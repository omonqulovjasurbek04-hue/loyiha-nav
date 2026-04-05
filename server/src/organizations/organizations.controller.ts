import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha idoralar ro\'yxatini olish' })
  async getAll(
    @Query('type') type?: string,
    @Query('district') district?: string,
  ) {
    return this.organizationsService.findAll({ type, district });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Idora tafsilotlarini olish' })
  async getOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Get(':id/services')
  @ApiOperation({ summary: 'Idora xizmatlarini olish' })
  async getServices(@Param('id') id: string) {
    return this.organizationsService.getServices(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yangi idora qo\'shish (admin)' })
  async create(@Body() data: any) {
    return this.organizationsService.create(data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Idorani tahrirlash (admin)' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.organizationsService.update(id, data);
  }
}
