import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { Service } from '../organizations/entities/service.entity';
import { User } from '../users/entities/user.entity';
import { Ticket, TicketStatus } from '../queues/entities/ticket.entity';
import { Queue } from '../queues/entities/queue.entity';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  CreateServiceDto,
  UpdateServiceDto,
  UpdateUserDto,
} from './admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(Queue)
    private readonly queueRepo: Repository<Queue>,
  ) {}

  // ─── Dashboard ───
  async getDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    const [totalOrgs, totalServices, totalUsers, totalTickets, todayTickets, activeTickets] =
      await Promise.all([
        this.orgRepo.count(),
        this.serviceRepo.count(),
        this.userRepo.count(),
        this.ticketRepo.count(),
        this.ticketRepo.count({
          where: { issued_at: Between(new Date(today), new Date(today + 'T23:59:59')) as any },
        }),
        this.ticketRepo.count({ where: { status: TicketStatus.WAITING } }),
      ]);

    return {
      total_organizations: totalOrgs,
      total_services: totalServices,
      total_users: totalUsers,
      total_tickets: totalTickets,
      today_tickets: todayTickets,
      active_tickets: activeTickets,
    };
  }

  // ─── Organizations ───
  async getAllOrganizations(type?: string, page = 1, limit = 20) {
    const where: any = {};
    if (type) where.type = type;
    const [data, total] = await this.orgRepo.findAndCount({
      where,
      relations: ['services'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getOrganizationById(id: string): Promise<Organization> {
    const org = await this.orgRepo.findOne({ where: { id }, relations: ['services'] });
    if (!org) throw new NotFoundException('Idora topilmadi');
    return org;
  }

  async createOrganization(dto: CreateOrganizationDto): Promise<Organization> {
    const org = this.orgRepo.create(dto);
    return this.orgRepo.save(org);
  }

  async updateOrganization(id: string, dto: UpdateOrganizationDto): Promise<Organization> {
    const org = await this.getOrganizationById(id);
    Object.assign(org, dto);
    return this.orgRepo.save(org);
  }

  async deleteOrganization(id: string): Promise<{ message: string }> {
    const org = await this.getOrganizationById(id);
    await this.orgRepo.remove(org);
    return { message: 'Idora o\'chirildi' };
  }

  // ─── Services ───
  async getAllServices(page = 1, limit = 20) {
    const [data, total] = await this.serviceRepo.findAndCount({
      relations: ['organization'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async createService(dto: CreateServiceDto): Promise<Service> {
    const service = this.serviceRepo.create(dto);
    return this.serviceRepo.save(service);
  }

  async updateService(id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) throw new NotFoundException('Xizmat topilmadi');
    Object.assign(service, dto);
    return this.serviceRepo.save(service);
  }

  async deleteService(id: string): Promise<{ message: string }> {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) throw new NotFoundException('Xizmat topilmadi');
    await this.serviceRepo.remove(service);
    return { message: 'Xizmat o\'chirildi' };
  }

  // ─── Users ───
  async getAllUsers(page = 1, limit = 20) {
    const [data, total] = await this.userRepo.findAndCount({
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.getUserById(id);
    await this.userRepo.remove(user);
    return { message: 'Foydalanuvchi o\'chirildi' };
  }

  // ─── Tickets ───
  async getAllTickets(date?: string, page = 1, limit = 50) {
    const where: any = {};
    if (date) {
      where.issued_at = Between(new Date(date), new Date(date + 'T23:59:59')) as any;
    }
    const [data, total] = await this.ticketRepo.findAndCount({
      where,
      relations: ['queue', 'user'],
      order: { issued_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getTicketStats(date?: string) {
    const today = date || new Date().toISOString().split('T')[0];
    const where: any = {
      issued_at: Between(new Date(today), new Date(today + 'T23:59:59')) as any,
    };

    const [total, waiting, called, completed, skipped, cancelled] = await Promise.all([
      this.ticketRepo.count({ where }),
      this.ticketRepo.count({ where: { ...where, status: TicketStatus.WAITING } }),
      this.ticketRepo.count({ where: { ...where, status: TicketStatus.CALLED } }),
      this.ticketRepo.count({ where: { ...where, status: TicketStatus.COMPLETED } }),
      this.ticketRepo.count({ where: { ...where, status: TicketStatus.SKIPPED } }),
      this.ticketRepo.count({ where: { ...where, status: TicketStatus.CANCELLED } }),
    ]);

    return { date: today, total, waiting, called, completed, skipped, cancelled };
  }
}
