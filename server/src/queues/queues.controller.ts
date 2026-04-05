import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { QueuesService } from './queues.service';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('tickets')
@Controller()
export class QueuesController {
  constructor(
    private readonly queuesService: QueuesService,
    private readonly ticketsService: TicketsService,
  ) {}

  @Get('queue/:serviceId/status')
  @ApiOperation({ summary: 'Navbat holatini olish' })
  async getQueueStatus(@Param('serviceId') serviceId: string) {
    return this.queuesService.getQueueStatus(serviceId);
  }

  @Get('queue/:serviceId/wait')
  @ApiOperation({ summary: 'Taxminiy kutish vaqtini olish' })
  async getWaitTime(@Param('serviceId') serviceId: string) {
    return this.queuesService.getEstimatedWait(serviceId);
  }

  @Post('tickets')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Navbat olish' })
  async createTicket(@Body('service_id') serviceId: string, @Req() req: any) {
    return this.ticketsService.create(serviceId, req.user.id);
  }

  @Get('tickets/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mening navbatlarim' })
  async getMyTickets(@Req() req: any) {
    return this.ticketsService.getUserTickets(req.user.id);
  }

  @Get('tickets/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Navbat tafsiloti' })
  async getTicket(@Param('id') id: string, @Req() req: any) {
    return this.ticketsService.getTicketById(id, req.user.id);
  }

  @Delete('tickets/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Navbatdan chiqish (bekor qilish)' })
  async cancelTicket(@Param('id') id: string, @Req() req: any) {
    return this.ticketsService.cancelTicket(id, req.user.id);
  }

  @Patch('tickets/:id/call')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Navbatni chaqirish (operator)' })
  async callTicket(
    @Param('id') id: string,
    @Body('window_number') windowNumber: number,
    @Req() req: any,
  ) {
    return this.ticketsService.callTicket(id, windowNumber, req.user.id);
  }

  @Patch('tickets/:id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xizmat tugallandi' })
  async completeTicket(@Param('id') id: string, @Req() req: any) {
    return this.ticketsService.completeTicket(id, req.user.id);
  }

  @Patch('tickets/:id/skip')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Navbatni o\'tkazib yuborish' })
  async skipTicket(@Param('id') id: string, @Req() req: any) {
    return this.ticketsService.skipTicket(id, req.user.id);
  }
}
