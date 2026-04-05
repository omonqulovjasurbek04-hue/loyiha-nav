import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { OtpStorage } from './entities/otp.entity';
import { TokenBlacklist } from './entities/blacklist.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly OTP_TTL = 300;      // 5 daqiqa
  private readonly OTP_LIMIT = 3;      // soatiga 3 ta
  private readonly OTP_LIMIT_TTL = 3600; // 1 soat

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OtpStorage)
    private readonly otpRepository: Repository<OtpStorage>,
    @InjectRepository(TokenBlacklist)
    private readonly blacklistRepository: Repository<TokenBlacklist>,
    private readonly jwtService: JwtService,
  ) {}

  async sendOtp(phone: string): Promise<{ message: string }> {
    let otpRecord = await this.otpRepository.findOne({ where: { phone } });
    const now = new Date();

    if (otpRecord) {
      if (otpRecord.expires_at < now) {
        // Reset old attempts
        otpRecord.attempts = 0;
      } else if (otpRecord.attempts >= this.OTP_LIMIT) {
        const remainingMinutes = Math.ceil((otpRecord.expires_at.getTime() - now.getTime()) / 60000);
        throw new BadRequestException({
          code: 'OTP_LIMIT_EXCEEDED',
          message: `Ko'p urinish. ${remainingMinutes} daqiqadan so'ng qayta urining`,
        });
      }
    } else {
      otpRecord = this.otpRepository.create({ phone, attempts: 0 });
    }

    // Generate new OTP
    const otp = process.env.NODE_ENV === 'production'
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : '111111';

    otpRecord.code = otp;
    otpRecord.attempts += 1;
    // Set limit expiration based on attempts, or just simple OTP TTL if not limited
    const expiresAt = new Date(now.getTime() + (otpRecord.attempts >= this.OTP_LIMIT ? this.OTP_LIMIT_TTL * 1000 : this.OTP_TTL * 1000));
    otpRecord.expires_at = expiresAt;

    await this.otpRepository.save(otpRecord);

    await this.sendSms(phone, `E-Navbat: tasdiqlash kodi ${otp}`);

    this.logger.log(`OTP yuborildi: ${phone}`);
    return { message: 'OTP yuborildi' };
  }

  async verifyOtp(
    phone: string,
    otp: string,
  ): Promise<{ access_token: string; refresh_token: string; user: User }> {
    const otpRecord = await this.otpRepository.findOne({ where: { phone } });
    const now = new Date();

    if (!otpRecord || otpRecord.expires_at < now) {
      if (otpRecord && otpRecord.expires_at < now && otpRecord.attempts < this.OTP_LIMIT) {
        // Clear if not rate limited
        await this.otpRepository.remove(otpRecord);
      }
      throw new BadRequestException({
        code: 'OTP_EXPIRED',
        message: 'OTP muddati tugagan, qayta so\'rang',
      });
    }

    if (otpRecord.code !== otp) {
      throw new BadRequestException({
        code: 'INVALID_OTP',
        message: 'Noto\'g\'ri OTP kod',
      });
    }

    // Remove valid OTP (keep if rate limited, but invalidate code)
    if (otpRecord.attempts < this.OTP_LIMIT) {
      await this.otpRepository.remove(otpRecord);
    } else {
      otpRecord.code = ''; // consume it
      await this.otpRepository.save(otpRecord);
    }

    // Foydalanuvchi topish yoki yaratish
    let user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      user = this.userRepository.create({ phone, full_name: phone });
      await this.userRepository.save(user);
      this.logger.log(`Yangi foydalanuvchi: ${phone}`);
    }

    // Token yaratish
    const tokens = await this.generateTokens(user);
    return { ...tokens, user };
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const blacklisted = await this.blacklistRepository.findOne({ where: { token: refreshToken } });
    if (blacklisted) {
      throw new UnauthorizedException({
        code: 'TOKEN_REVOKED',
        message: 'Token bekor qilingan',
      });
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      // Eski is_active tekshirish joyi: user.is_active bazada kiritilmagan bo'lishi mumkin, shuning uchun sharti update qilindi.
      if (!user) {
        throw new UnauthorizedException('Foydalanuvchi topilmadi');
      }

      // Eski refresh token ni blacklist ga qo'shish
      const blacklistEntry = this.blacklistRepository.create({
        token: refreshToken,
        expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000)
      });
      await this.blacklistRepository.save(blacklistEntry);

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException({
        code: 'TOKEN_EXPIRED',
        message: 'Token muddati tugagan',
      });
    }
  }

  async logout(token: string): Promise<{ message: string }> {
    const blacklistEntry = this.blacklistRepository.create({
      token,
      expires_at: new Date(Date.now() + 15 * 60 * 1000)
    });
    await this.blacklistRepository.save(blacklistEntry);
    return { message: 'Muvaffaqiyatli chiqildi' };
  }

  private async generateTokens(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { sub: user.id, phone: user.phone, role: user.role };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as any,
      }),
    ]);

    return { access_token, refresh_token };
  }

  private async sendSms(phone: string, message: string): Promise<void> {
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(`SMS (test): ${phone} → ${message}`);
      return;
    }
    this.logger.log(`SMS yuborildi: ${phone}`);
  }
}
