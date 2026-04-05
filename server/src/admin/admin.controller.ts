import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  CreateServiceDto,
  UpdateServiceDto,
  UpdateUserDto,
} from './admin.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── Dashboard ───
  @Get('dashboard')
  @ApiOperation({ summary: 'Admin dashboard statistikasi' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  // ─── Organizations ───
  @Get('organizations')
  @ApiOperation({ summary: 'Barcha idoralar (admin)' })
  async getAllOrgs(@Query('type') type?: string) {
    return this.adminService.getAllOrganizations(type);
  }

  @Get('organizations/:id')
  @ApiOperation({ summary: 'Idora tafsiloti (admin)' })
  async getOrg(@Param('id') id: string) {
    return this.adminService.getOrganizationById(id);
  }

  @Post('organizations')
  @ApiOperation({ summary: 'Yangi idora qo\'shish' })
  async createOrg(@Body() dto: CreateOrganizationDto) {
    return this.adminService.createOrganization(dto);
  }

  @Put('organizations/:id')
  @ApiOperation({ summary: 'Idorani tahrirlash' })
  async updateOrg(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    return this.adminService.updateOrganization(id, dto);
  }

  @Delete('organizations/:id')
  @ApiOperation({ summary: 'Idorani o\'chirish' })
  async deleteOrg(@Param('id') id: string) {
    return this.adminService.deleteOrganization(id);
  }

  // ─── Services ───
  @Get('services')
  @ApiOperation({ summary: 'Barcha xizmatlar (admin)' })
  async getAllServices() {
    return this.adminService.getAllServices();
  }

  @Post('services')
  @ApiOperation({ summary: 'Yangi xizmat qo\'shish' })
  async createService(@Body() dto: CreateServiceDto) {
    return this.adminService.createService(dto);
  }

  @Put('services/:id')
  @ApiOperation({ summary: 'Xizmatni tahrirlash' })
  async updateService(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.adminService.updateService(id, dto);
  }

  @Delete('services/:id')
  @ApiOperation({ summary: 'Xizmatni o\'chirish' })
  async deleteService(@Param('id') id: string) {
    return this.adminService.deleteService(id);
  }

  // ─── Users ───
  @Get('users')
  @ApiOperation({ summary: 'Barcha foydalanuvchilar (admin)' })
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Foydalanuvchi tafsiloti (admin)' })
  async getUser(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Foydalanuvchini tahrirlash' })
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.adminService.updateUser(id, dto);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Foydalanuvchini o\'chirish' })
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // ─── Tickets ───
  @Get('tickets')
  @ApiOperation({ summary: 'Barcha navbatlar (admin)' })
  async getAllTickets(@Query('date') date?: string) {
    return this.adminService.getAllTickets(date);
  }

  @Get('tickets/stats')
  @ApiOperation({ summary: 'Navbat statistikasi' })
  async getTicketStats(@Query('date') date?: string) {
    return this.adminService.getTicketStats(date);
  }
}
