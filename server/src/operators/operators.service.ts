import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operator, OperatorStatus } from '../users/entities/operator.entity';
import { Ticket, TicketStatus } from '../queues/entities/ticket.entity';
import { Queue } from '../queues/entities/queue.entity';
import { QueueGateway } from '../notifications/gateways/queue.gateway';

@Injectable()
export class OperatorsService {
  private readonly logger = new Logger(OperatorsService.name);

  constructor(
    @InjectRepository(Operator)
    private readonly operatorRepository: Repository<Operator>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Queue)
    private readonly queueRepository: Repository<Queue>,
    private readonly queueGateway: QueueGateway,
  ) {}

  async findByUserId(userId: string): Promise<Operator | null> {
    return this.operatorRepository.findOne({
      where: { user_id: userId },
      relations: ['organization', 'current_ticket'],
    });
  }

  async getOperatorWindow(userId: string): Promise<{
    operator: Operator;
    currentTicket: Ticket | null;
    waitingTickets: Ticket[];
  }> {
    const operator = await this.findByUserId(userId);
    if (!operator) {
      throw new NotFoundException('Operator topilmadi');
    }

    const currentTicket = operator.current_ticket_id
      ? await this.ticketRepository.findOne({
          where: { id: operator.current_ticket_id },
          relations: ['queue', 'queue.service', 'user'],
        })
      : null;

    const waitingTickets = await this.ticketRepository.find({
      where: {
        queue: {
          service: { org_id: operator.org_id },
        },
        status: TicketStatus.WAITING,
      },
      relations: ['queue', 'queue.service', 'user'],
      order: { ticket_number: 'ASC' },
      take: 10,
    });

    return { operator, currentTicket, waitingTickets };
  }

  async callNext(userId: string): Promise<Ticket> {
    const operator = await this.findByUserId(userId);
    if (!operator) {
      throw new NotFoundException('Operator topilmadi');
    }

    if (operator.status !== OperatorStatus.ACTIVE) {
      throw new BadRequestException('Operator faol holatda emas');
    }

    const nextTicket = await this.ticketRepository.findOne({
      where: {
        queue: {
          service: { org_id: operator.org_id },
        },
        status: TicketStatus.WAITING,
      },
      relations: ['queue', 'user'],
      order: { ticket_number: 'ASC' },
    });

    if (!nextTicket) {
      throw new BadRequestException('Kutayotgan navbatlar yo\'q');
    }

    nextTicket.status = TicketStatus.CALLED;
    nextTicket.called_at = new Date();
    nextTicket.window_number = operator.window_number;
    await this.ticketRepository.save(nextTicket);

    operator.current_ticket_id = nextTicket.id;
    await this.operatorRepository.save(operator);

    await this.queueGateway.callTicket(
      nextTicket.id,
      nextTicket.ticket_number,
      operator.window_number,
      nextTicket.user_id,
    );

    this.logger.log(`Navbat chaqirildi: #${nextTicket.ticket_number} → ${operator.window_number}`);
    return nextTicket;
  }

  async completeTicket(userId: string): Promise<Ticket> {
    const operator = await this.findByUserId(userId);
    if (!operator || !operator.current_ticket_id) {
      throw new BadRequestException('Aktiv navbat yo\'q');
    }

    const ticket = await this.ticketRepository.findOne({
      where: { id: operator.current_ticket_id },
      relations: ['queue'],
    });

    if (!ticket) {
      throw new NotFoundException('Navbat topilmadi');
    }

    ticket.status = TicketStatus.COMPLETED;
    ticket.completed_at = new Date();
    await this.ticketRepository.save(ticket);

    const queue = ticket.queue;
    if (queue.current_number < ticket.ticket_number) {
      queue.current_number = ticket.ticket_number;
      await this.queueRepository.save(queue);
    }

    operator.current_ticket_id = null;
    await this.operatorRepository.save(operator);

    this.logger.log(`Navbat yakunlandi: #${ticket.ticket_number}`);
    return ticket;
  }

  async skipTicket(userId: string): Promise<Ticket> {
    const operator = await this.findByUserId(userId);
    if (!operator || !operator.current_ticket_id) {
      throw new BadRequestException('Aktiv navbat yo\'q');
    }

    const ticket = await this.ticketRepository.findOne({
      where: { id: operator.current_ticket_id },
      relations: ['user'],
    });

    if (!ticket) {
      throw new NotFoundException('Navbat topilmadi');
    }

    ticket.status = TicketStatus.SKIPPED;
    await this.ticketRepository.save(ticket);

    await this.queueGateway.emitToUser(ticket.user_id, 'ticket_skipped', {
      message: 'Sizning navbatingiz o\'tkazib yuborildi',
    });

    operator.current_ticket_id = null;
    await this.operatorRepository.save(operator);

    return ticket;
  }

  async updateStatus(userId: string, status: 'ACTIVE' | 'BREAK' | 'OFFLINE'): Promise<Operator> {
    const operator = await this.findByUserId(userId);
    if (!operator) {
      throw new NotFoundException('Operator topilmadi');
    }

    operator.status = status as OperatorStatus;
    return this.operatorRepository.save(operator);
  }
}
