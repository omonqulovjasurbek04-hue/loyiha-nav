import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueuesController } from './queues.controller';
import { QueuesService } from './queues.service';
import { TicketsService } from './tickets.service';
import { Queue } from './entities/queue.entity';
import { Ticket } from './entities/ticket.entity';
import { Service } from '../organizations/entities/service.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Queue, Ticket, Service]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [QueuesController],
  providers: [QueuesService, TicketsService],
  exports: [TicketsService],
})
export class QueuesModule {}
