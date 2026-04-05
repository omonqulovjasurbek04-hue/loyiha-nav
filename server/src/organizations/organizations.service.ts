import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { Service } from './entities/service.entity';

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async findAll(filters: { type?: string; district?: string }): Promise<Organization[]> {
    const where: any = { is_active: true };
    if (filters.type) where.type = filters.type;
    if (filters.district) where.district_id = filters.district;
    return this.orgRepository.find({ where, relations: ['services'] });
  }

  async findOne(id: string): Promise<Organization> {
    const org = await this.orgRepository.findOne({
      where: { id },
      relations: ['services'],
    });
    if (!org) {
      throw new NotFoundException('Idora topilmadi');
    }
    return org;
  }

  async getServices(orgId: string): Promise<Service[]> {
    const org = await this.orgRepository.findOne({ where: { id: orgId } });
    if (!org) {
      throw new NotFoundException('Idora topilmadi');
    }
    return this.serviceRepository.find({
      where: { org_id: orgId, is_active: true },
    });
  }

  async create(data: Partial<Organization>): Promise<Organization> {
    const org = this.orgRepository.create(data);
    return this.orgRepository.save(org);
  }

  async update(id: string, data: Partial<Organization>): Promise<Organization> {
    const org = await this.findOne(id);
    Object.assign(org, data);
    return this.orgRepository.save(org);
  }
}
