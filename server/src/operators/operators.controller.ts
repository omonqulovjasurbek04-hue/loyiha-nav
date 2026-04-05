import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateOperatorStatusDto, CallNextTicketDto } from './dto/operator.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('operators')
@Controller('operators')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OperatorsController {
  constructor(private readonly operatorsService: OperatorsService) {}

  @Get('window')
  @ApiOperation({ summary: 'Operator paneli' })
  async getWindow(@Req() req: any) {
    return this.operatorsService.getOperatorWindow(req.user.id);
  }

  @Post('next')
  @ApiOperation({ summary: 'Keyingi navbatni chaqirish' })
  async callNext(@Req() req: any, @Body() _dto?: CallNextTicketDto) {
    return this.operatorsService.callNext(req.user.id);
  }

  @Patch('complete')
  @ApiOperation({ summary: 'Xizmat yakunlandi' })
  async complete(@Req() req: any) {
    return this.operatorsService.completeTicket(req.user.id);
  }

  @Patch('skip')
  @ApiOperation({ summary: 'Navbatni o\'tkazib yuborish' })
  async skip(@Req() req: any) {
    return this.operatorsService.skipTicket(req.user.id);
  }

  @Patch('status')
  @ApiOperation({ summary: 'Operator holatini o\'zgartirish' })
  async updateStatus(@Req() req: any, @Body() dto: UpdateOperatorStatusDto) {
    return this.operatorsService.updateStatus(req.user.id, dto.status);
  }
}
