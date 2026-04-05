import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsEnum } from 'class-validator';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  district_id?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  district_id?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  org_id: string;

  @IsOptional()
  @IsNumber()
  duration_minutes?: number;

  @IsOptional()
  @IsNumber()
  daily_limit?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  duration_minutes?: number;

  @IsOptional()
  @IsNumber()
  daily_limit?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsEnum(['citizen', 'operator', 'admin', 'superadmin'])
  role?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
