import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from './entities/queue.entity';
import { Service } from '../organizations/entities/service.entity';

@Injectable()
export class QueuesService {
  private readonly logger = new Logger(QueuesService.name);

  constructor(
    @InjectRepository(Queue)
    private readonly queueRepository: Repository<Queue>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async getQueueStatus(serviceId: string): Promise<{
    current_number: number;
    total_issued: number;
    waiting_count: number;
  }> {
    const today = new Date().toLocaleString('en-CA', { timeZone: 'Asia/Tashkent' }).split(',')[0];
    const queue = await this.queueRepository.findOne({
      where: { service_id: serviceId, date: today as any },
    });

    if (!queue) {
      return { current_number: 0, total_issued: 0, waiting_count: 0 };
    }

    const result = {
      current_number: queue.current_number,
      total_issued: queue.total_issued,
      waiting_count: queue.total_issued - queue.current_number,
    };

    return result;
  }

  async getEstimatedWait(serviceId: string): Promise<{ minutes: number }> {
    const status = await this.getQueueStatus(serviceId);
    const service = await this.serviceRepository.findOne({ where: { id: serviceId } });
    const duration = service?.duration_minutes || 15;
    const minutes = Math.max(0, status.waiting_count) * duration;
    return { minutes };
  }

  async invalidateCache(serviceId: string): Promise<void> {
    // Redis olib tashlangani uchun, endi bu joyda kesh o'chirilmaydi
  }
}
