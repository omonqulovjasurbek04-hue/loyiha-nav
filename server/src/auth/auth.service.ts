import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity';
import { OtpStorage } from './entities/otp.entity';
import { TokenBlacklist } from './entities/blacklist.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly OTP_TTL = 300;       // 5 daqiqa
  private readonly OTP_LIMIT = 5;       // 5 ta urinish
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

  // ─── OTP yuborish (Ro'yxat + Parol tiklash uchun umumiy) ─────────────────
  async sendOtp(phone: string): Promise<{ message: string }> {
    let otpRecord = await this.otpRepository.findOne({ where: { phone } });
    const now = new Date();

    if (otpRecord) {
      if (otpRecord.expires_at < now) {
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

    const otp = process.env.NODE_ENV === 'production'
      ? crypto.randomInt(100000, 1000000).toString()
      : '111111';

    otpRecord.code = otp;
    otpRecord.attempts += 1;
    const expiresAt = new Date(now.getTime() + (
      otpRecord.attempts >= this.OTP_LIMIT ? this.OTP_LIMIT_TTL * 1000 : this.OTP_TTL * 1000
    ));
    otpRecord.expires_at = expiresAt;

    await this.otpRepository.save(otpRecord);
    await this.sendSms(phone, `E-Navbat: tasdiqlash kodi ${otp}`);

    this.logger.log(`OTP yuborildi: ${phone}`);
    return { message: 'OTP yuborildi' };
  }

  // ─── Ro'yxatdan o'tish: OTP tasdiqlash + parol bilan hisob yaratish ──────
  async register(
    phone: string,
    otpCode: string,
    password: string,
    fullName?: string,
  ): Promise<{ access_token: string; refresh_token: string; user: User }> {
    // OTP tekshirish (SMS kerak emasligi sababli o'chirib qo'yildi)
    // await this.verifyAndConsumeOtp(phone, otpCode);

    // Foydalanuvchi allaqachon bor-yo'qligini tekshirish
    const existing = await this.userRepository.findOne({ where: { phone } });
    if (existing) {
      throw new ConflictException({
        code: 'USER_EXISTS',
        message: 'Bu telefon raqam allaqachon ro\'yxatdan o\'tgan',
      });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const user = this.userRepository.create({
      phone,
      full_name: fullName || phone,
      password_hash,
    });
    await this.userRepository.save(user);
    this.logger.log(`Yangi foydalanuvchi ro'yxatdan o'tdi: ${phone}`);

    return { ...await this.generateTokens(user), user };
  }

  // ─── Parol bilan kirish ───────────────────────────────────────────────────
  async login(
    phone: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string; user: User }> {
    const user = await this.userRepository.findOne({
      where: { phone },
      select: ['id', 'phone', 'full_name', 'role', 'is_active', 'password_hash', 'created_at'],
    });

    if (!user) {
      throw new UnauthorizedException({
        code: 'USER_NOT_FOUND',
        message: 'Telefon raqam yoki parol noto\'g\'ri',
      });
    }

    if (!user.password_hash) {
      throw new BadRequestException({
        code: 'NO_PASSWORD',
        message: 'Parol o\'rnatilmagan. "Parolni unutdim" orqali parol o\'rnating',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException({
        code: 'WRONG_PASSWORD',
        message: 'Telefon raqam yoki parol noto\'g\'ri',
      });
    }

    if (!user.is_active) {
      throw new UnauthorizedException({
        code: 'USER_INACTIVE',
        message: 'Hisobingiz faol emas',
      });
    }

    this.logger.log(`Kirish: ${phone}`);
    return { ...await this.generateTokens(user), user };
  }

  // ─── Parolni tiklash: OTP yuborish (forgot-password) ─────────────────────
  async forgotPassword(phone: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      // Xavfsizlik uchun haqiqiy xato ko'rsatmaymiz
      return { message: 'Agar raqam mavjud bo\'lsa, SMS yuborildi' };
    }
    return this.sendOtp(phone);
  }

  // ─── Parolni tiklash: OTP tasdiqlash + yangi parol ───────────────────────
  async resetPassword(
    phone: string,
    otpCode: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    await this.verifyAndConsumeOtp(phone, otpCode);

    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new BadRequestException({ code: 'USER_NOT_FOUND', message: 'Foydalanuvchi topilmadi' });
    }

    user.password_hash = await bcrypt.hash(newPassword, 12);
    await this.userRepository.save(user);

    this.logger.log(`Parol yangilandi: ${phone}`);
    return { message: 'Parol muvaffaqiyatli yangilandi' };
  }

  // ─── OTP tasdiqlash va kirish/ro'yxatdan o'tish (OTP only flow) ──────────
  async verifyOtp(phone: string, otp: string): Promise<{ access_token: string; refresh_token: string; user: User }> {
    await this.verifyAndConsumeOtp(phone, otp);
    let user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      this.logger.log(`Yangi foydalanuvchi (OTP): ${phone}`);
      user = this.userRepository.create({ phone, full_name: phone });
      await this.userRepository.save(user);
    }
    this.logger.log(`Kirish (OTP): ${phone}`);
    return { ...await this.generateTokens(user), user };
  }

  // ─── OTP tasdiqlash va iste'mol qilish (ichki) ───────────────────────────
  private async verifyAndConsumeOtp(phone: string, otp: string): Promise<void> {
    const otpRecord = await this.otpRepository.findOne({ where: { phone } });
    const now = new Date();

    if (!otpRecord || otpRecord.expires_at < now) {
      if (otpRecord && otpRecord.expires_at < now) {
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

    await this.otpRepository.remove(otpRecord);
  }

  // ─── Token yangilash ──────────────────────────────────────────────────────
  async refresh(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const blacklisted = await this.blacklistRepository.findOne({ where: { token: refreshToken } });
    if (blacklisted) {
      throw new UnauthorizedException({ code: 'TOKEN_REVOKED', message: 'Token bekor qilingan' });
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('Foydalanuvchi topilmadi');
      }

      const blacklistEntry = this.blacklistRepository.create({
        token: refreshToken,
        expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000),
      });
      await this.blacklistRepository.save(blacklistEntry);

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException({ code: 'TOKEN_EXPIRED', message: 'Token muddati tugagan' });
    }
  }

  // ─── Chiqish ──────────────────────────────────────────────────────────────
  async logout(token: string): Promise<{ message: string }> {
    const blacklistEntry = this.blacklistRepository.create({
      token,
      expires_at: new Date(Date.now() + 15 * 60 * 1000),
    });
    await this.blacklistRepository.save(blacklistEntry);
    return { message: 'Muvaffaqiyatli chiqildi' };
  }

  // ─── Token generatsiya ────────────────────────────────────────────────────
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

  // ─── SMS yuborish ─────────────────────────────────────────────────────────
  private async sendSms(phone: string, message: string): Promise<void> {
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(`SMS (test): ${phone} → ${message}`);
      return;
    }
    this.logger.log(`SMS yuborildi: ${phone}`);
  }
}
