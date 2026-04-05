import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperatorsController } from './operators.controller';
import { OperatorsService } from './operators.service';
import { Operator } from '../users/entities/operator.entity';
import { Ticket } from '../queues/entities/ticket.entity';
import { Queue } from '../queues/entities/queue.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Operator, Ticket, Queue]),
    NotificationsModule,
  ],
  controllers: [OperatorsController],
  providers: [OperatorsService],
  exports: [OperatorsService],
})
export class OperatorsModule {}
