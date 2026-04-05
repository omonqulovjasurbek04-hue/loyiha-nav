import {
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { Queue } from './entities/queue.entity';
import { QueueGateway } from '../notifications/gateways/queue.gateway';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Queue)
    private readonly queueRepository: Repository<Queue>,
    private readonly dataSource: DataSource,
    @InjectRedis() private readonly redis: Redis,
    private readonly queueGateway: QueueGateway,
  ) {}

  async create(serviceId: string, userId: string): Promise<Ticket> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Foydalanuvchida aktiv ticket bormi?
      const activeTicket = await queryRunner.manager.findOne(Ticket, {
        where: { user: { id: userId }, status: TicketStatus.WAITING },
      });

      if (activeTicket) {
        throw new BadRequestException({
          code: 'TICKET_LIMIT_EXCEEDED',
          message: 'Sizda allaqachon aktiv navbat mavjud',
        });
      }

      // 2. Bugungi queue topish yoki yaratish (PESSIMISTIC LOCK)
      const today = new Date().toISOString().split('T')[0];
      let queue = await queryRunner.manager.findOne(Queue, {
        where: { service: { id: serviceId }, date: today as any },
        lock: { mode: 'pessimistic_write' },
      });

      if (!queue) {
        queue = queryRunner.manager.create(Queue, {
          service: { id: serviceId },
          date: today as any,
          current_number: 0,
          total_issued: 0,
        });
        await queryRunner.manager.save(queue);
      }

      // 3. Limit tekshirish
      // NOTE: QISM 2 Service entity request: 'Service'. Assuming it exists.
      const service = await queryRunner.manager.findOne('Service', {
        where: { id: serviceId },
      });

      if (service && queue.total_issued >= (service as any).daily_limit) {
        throw new BadRequestException({
          code: 'QUEUE_FULL',
          message: 'Bugunlik navbat to\'ldi, ertaga keling',
        });
      }

      // 4. Ticket yaratish
      queue.total_issued += 1;
      await queryRunner.manager.save(queue);

      const ticket = queryRunner.manager.create(Ticket, {
        queue: { id: queue.id },
        user: { id: userId },
        ticket_number: queue.total_issued,
        status: TicketStatus.WAITING,
      });

      await queryRunner.manager.save(ticket);
      await queryRunner.commitTransaction();

      // 5. Redis cache yangilash
      await this.updateQueueCache(queue.id);

      // 6. WebSocket orqali barcha kutayotganlarga yangilash
      await this.queueGateway.broadcastQueueUpdate(queue.id);

      this.logger.log(`Ticket yaratildi: #${ticket.ticket_number} → ${userId}`);

      return ticket;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getQueueStatus(serviceId: string): Promise<{
    position: number;
    waiting_count: number;
    estimated_wait: number;
  }> {
    const cacheKey = `queue:status:${serviceId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const today = new Date().toISOString().split('T')[0];
    const queue = await this.queueRepository.findOne({
      where: { service: { id: serviceId }, date: today as any },
    });

    if (!queue) {
      return { position: 0, waiting_count: 0, estimated_wait: 0 };
    }

    const waiting_count = await this.ticketRepository.count({
      where: { queue: { id: queue.id }, status: TicketStatus.WAITING },
    });

    const result = {
      position: queue.current_number,
      waiting_count,
      estimated_wait: waiting_count * 15,
    };

    await this.redis.setex(cacheKey, 10, JSON.stringify(result));
    return result;
  }

  private async updateQueueCache(queueId: string): Promise<void> {
    await this.redis.del(`queue:status:${queueId}`);
  }
}
