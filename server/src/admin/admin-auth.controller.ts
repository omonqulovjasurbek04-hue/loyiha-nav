import { Body, Controller, Post } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

class AdminLoginDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AdminAuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('admin-login')
  @ApiOperation({ summary: 'Admin parol bilan kirish' })
  async adminLogin(@Body() dto: AdminLoginDto) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || dto.password !== adminPassword) {
      throw new Error('Parol noto\'g\'ri');
    }

    const payload = {
      sub: 'admin',
      phone: 'admin',
      role: 'admin',
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '8h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      data: {
        access_token,
        refresh_token,
        user: { role: 'admin' },
      },
    };
  }
}
