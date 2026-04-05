import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+998\d{9}$/, { message: "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak" })
  phone: string;
}

export class VerifyOtpDto extends SendOtpDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
