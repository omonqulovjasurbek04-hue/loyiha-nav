import { IsNotEmpty, IsString, Matches, MinLength, IsOptional } from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+998\d{9}$/, { message: "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak" })
  phone: string;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+998\d{9}$/, { message: "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak" })
  phone: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}

// --- YANGI DTOlar ---

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+998\d{9}$/, { message: "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak" })
  phone: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: "Parol kamida 6 belgidan iborat bo'lishi kerak" })
  password: string;

  @IsOptional()
  @IsString()
  otp_code?: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+998\d{9}$/, { message: "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak" })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: "Parol kamida 6 belgidan iborat bo'lishi kerak" })
  password: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+998\d{9}$/, { message: "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak" })
  phone: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+998\d{9}$/, { message: "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak" })
  phone: string;

  @IsNotEmpty()
  @IsString()
  otp_code: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: "Parol kamida 6 belgidan iborat bo'lishi kerak" })
  new_password: string;
}
