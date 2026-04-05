import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOperatorStatusDto {
  @IsNotEmpty()
  @IsString()
  status: 'ACTIVE' | 'BREAK' | 'OFFLINE';
}

export class CallNextTicketDto {
  @IsOptional()
  @IsNumber()
  window_number?: number;
}
