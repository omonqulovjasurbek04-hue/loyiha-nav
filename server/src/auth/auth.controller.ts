import { Body, Controller, Post, Req, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, RefreshTokenDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Telefon raqamga OTP yuborish' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.phone);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'OTP tasdiqlash va tizimga kirish (faqat OTP bilan)' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.phone, dto.code);
  }

  @Post('register')
  @ApiOperation({ summary: 'OTP orqali tasdiqlab, parol bilan ro\'yxatdan o\'tish' })
  async register(@Body() dto: import('./dto/auth.dto').RegisterDto) {
    return this.authService.register(dto.phone, dto.otp_code || '', dto.password, dto.full_name);
  }

  @Post('login')
  @ApiOperation({ summary: 'Telefon va parol orqali tizimga kirish' })
  async login(@Body() dto: import('./dto/auth.dto').LoginDto) {
    return this.authService.login(dto.phone, dto.password);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Parolni tiklash uchun SMS kod yuborish' })
  async forgotPassword(@Body() dto: import('./dto/auth.dto').ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.phone);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'SMS kod orqali parolni tiklash' })
  async resetPassword(@Body() dto: import('./dto/auth.dto').ResetPasswordDto) {
    return this.authService.resetPassword(dto.phone, dto.otp_code, dto.new_password);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Tokenni yangilash' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refresh_token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chiqish (tokenni bekor qilish)' })
  async logout(@Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');
    return this.authService.logout(token);
  }

  @Post('send-otp/resend')
  @ApiOperation({ summary: 'OTP ni qayta yuborish' })
  async resendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.phone);
  }
}
