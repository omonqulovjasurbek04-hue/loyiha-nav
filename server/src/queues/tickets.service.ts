import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { Queue } from './entities/queue.entity';
import { Service } from '../organizations/entities/service.entity';
import { QueueGateway } from '../notifications/gateways/queue.gateway';
import { QueuesService } from './queues.service';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Queue)
    private readonly queueRepository: Repository<Queue>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly dataSource: DataSource,
    private readonly queueGateway: QueueGateway,
    private readonly queuesService: QueuesService,
  ) {}

  async create(serviceId: string, userId: string): Promise<Ticket> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const activeTicket = await queryRunner.manager.findOne(Ticket, {
        where: { user_id: userId, status: TicketStatus.WAITING },
      });

      if (activeTicket) {
        throw new BadRequestException({
          code: 'TICKET_LIMIT_EXCEEDED',
          message: 'Sizda allaqachon aktiv navbat mavjud',
        });
      }

      const today = new Date().toISOString().split('T')[0];
      let queue = await queryRunner.manager.findOne(Queue, {
        where: { service_id: serviceId, date: today as any },
        lock: { mode: 'pessimistic_write' },
      });

      const service = await queryRunner.manager.findOne(Service, {
        where: { id: serviceId },
      });

      if (!service) {
        throw new NotFoundException('Xizmat topilmadi');
      }

      if (!service.is_active) {
        throw new BadRequestException({
          code: 'SERVICE_CLOSED',
          message: 'Bu xizmat hozir faol emas',
        });
      }

      if (!queue) {
        queue = queryRunner.manager.create(Queue, {
          service_id: serviceId,
          date: today as any,
          current_number: 0,
          total_issued: 0,
        });
        await queryRunner.manager.save(queue);
      }

      if (service.daily_limit && queue.total_issued >= service.daily_limit) {
        throw new BadRequestException({
          code: 'QUEUE_FULL',
          message: 'Bugunlik navbat to\'ldi, ertaga keling',
        });
      }

      queue.total_issued += 1;
      await queryRunner.manager.save(queue);

      const ticket = queryRunner.manager.create(Ticket, {
        queue_id: queue.id,
        user_id: userId,
        ticket_number: queue.total_issued,
        status: TicketStatus.WAITING,
      });

      await queryRunner.manager.save(ticket);
      await queryRunner.commitTransaction();

      await this.queuesService.invalidateCache(serviceId);
      await this.queueGateway.broadcastQueueUpdate(queue.id);
      await this.queueGateway.emitToUser(ticket.user_id, 'ticket_issued', {
        ticket_id: ticket.id,
        ticket_number: ticket.ticket_number,
        message: `Sizning navbat raqamingiz: ${ticket.ticket_number}`,
      });

      this.logger.log(`Ticket yaratildi: #${ticket.ticket_number} → ${userId}`);
      return ticket;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserTickets(userId: string): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: { user_id: userId },
      relations: ['queue', 'queue.service'],
      order: { issued_at: 'DESC' },
    });
  }

  async getTicketById(id: string, userId: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['queue', 'queue.service'],
    });

    if (!ticket) {
      throw new NotFoundException('Navbat topilmadi');
    }

    if (ticket.user_id !== userId) {
      throw new ForbiddenException('Bu navbat sizga tegishli emas');
    }

    return ticket;
  }

  async cancelTicket(id: string, userId: string): Promise<{ message: string }> {
    const ticket = await this.ticketRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!ticket) {
      throw new NotFoundException('Navbat topilmadi');
    }

    if (ticket.status !== TicketStatus.WAITING) {
      throw new BadRequestException('Faqat kutayotgan navbatni bekor qilish mumkin');
    }

    ticket.status = TicketStatus.CANCELLED;
    await this.ticketRepository.save(ticket);

    await this.queuesService.invalidateCache(ticket.queue_id);

    return { message: 'Navbat bekor qilindi' };
  }

  async callTicket(id: string, windowNumber: number, operatorId: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['queue'],
    });

    if (!ticket) {
      throw new NotFoundException('Navbat topilmadi');
    }

    if (ticket.status !== TicketStatus.WAITING) {
      throw new BadRequestException('Bu navbatni chaqirib bo\'lmaydi');
    }

    ticket.status = TicketStatus.CALLED;
    ticket.called_at = new Date();
    ticket.window_number = windowNumber;
    await this.ticketRepository.save(ticket);

    await this.queueGateway.callTicket(
      ticket.id,
      ticket.ticket_number,
      windowNumber,
      ticket.user_id,
    );

    this.logger.log(`Ticket chaqirildi: #${ticket.ticket_number} → ${windowNumber}`);
    return ticket;
  }

  async completeTicket(id: string, operatorId: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['queue'],
    });

    if (!ticket) {
      throw new NotFoundException('Navbat topilmadi');
    }

    if (![TicketStatus.CALLED, TicketStatus.IN_PROGRESS].includes(ticket.status)) {
      throw new BadRequestException('Bu navbatni yakunlab bo\'lmaydi');
    }

    ticket.status = TicketStatus.COMPLETED;
    ticket.completed_at = new Date();

    const queue = ticket.queue;
    if (queue.current_number < ticket.ticket_number) {
      queue.current_number = ticket.ticket_number;
      await this.queueRepository.save(queue);
    }

    await this.ticketRepository.save(ticket);
    await this.queuesService.invalidateCache(queue.service_id);

    this.logger.log(`Ticket yakunlandi: #${ticket.ticket_number}`);
    return ticket;
  }

  async skipTicket(id: string, operatorId: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['queue'],
    });

    if (!ticket) {
      throw new NotFoundException('Navbat topilmadi');
    }

    if (ticket.status !== TicketStatus.CALLED) {
      throw new BadRequestException('Bu navbatni o\'tkazib bo\'lmaydi');
    }

    ticket.status = TicketStatus.SKIPPED;
    await this.ticketRepository.save(ticket);

    await this.queueGateway.emitToUser(ticket.user_id, 'ticket_skipped', {
      message: 'Sizning navbatingiz o\'tkazib yuborildi',
    });

    return ticket;
  }
}
