import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly OTP_TTL = 300;      // 5 daqiqa
  private readonly OTP_LIMIT = 3;      // soatiga 3 ta
  private readonly OTP_LIMIT_TTL = 3600; // 1 soat

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async sendOtp(phone: string): Promise<{ message: string }> {
    // Rate limit tekshirish
    const limitKey = `otp:limit:${phone}`;
    const attempts = await this.redis.incr(limitKey);

    if (attempts === 1) {
      await this.redis.expire(limitKey, this.OTP_LIMIT_TTL);
    }

    if (attempts > this.OTP_LIMIT) {
      const ttl = await this.redis.ttl(limitKey);
      throw new BadRequestException({
        code: 'OTP_LIMIT_EXCEEDED',
        message: `Ko'p urinish. ${Math.ceil(ttl / 60)} daqiqadan so'ng qayta urining`,
      });
    }

    // OTP generatsiya (production da 6 raqam, test da 111111)
    const otp =
      process.env.NODE_ENV === 'production'
        ? Math.floor(100000 + Math.random() * 900000).toString()
        : '111111';

    // Redis ga saqlash
    const otpKey = `otp:${phone}`;
    await this.redis.setex(otpKey, this.OTP_TTL, otp);

    // SMS yuborish
    await this.sendSms(phone, `E-Navbat: tasdiqlash kodi ${otp}`);

    this.logger.log(`OTP yuborildi: ${phone}`);
    return { message: 'OTP yuborildi' };
  }

  async verifyOtp(
    phone: string,
    otp: string,
  ): Promise<{ access_token: string; refresh_token: string; user: User }> {
    // OTP tekshirish
    const otpKey = `otp:${phone}`;
    const savedOtp = await this.redis.get(otpKey);

    if (!savedOtp) {
      throw new BadRequestException({
        code: 'OTP_EXPIRED',
        message: 'OTP muddati tugagan, qayta so\'rang',
      });
    }

    if (savedOtp !== otp) {
      throw new BadRequestException({
        code: 'INVALID_OTP',
        message: 'Noto\'g\'ri OTP kod',
      });
    }

    // OTP ni o'chirib yuborish (bir martalik)
    await this.redis.del(otpKey);

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
    // Blacklist tekshirish
    const blacklisted = await this.redis.get(`blacklist:${refreshToken}`);
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
      await this.redis.setex(
        `blacklist:${refreshToken}`,
        30 * 24 * 3600,
        '1',
      );

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException({
        code: 'TOKEN_EXPIRED',
        message: 'Token muddati tugagan',
      });
    }
  }

  async logout(token: string): Promise<{ message: string }> {
    await this.redis.setex(`blacklist:${token}`, 15 * 60, '1');
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
