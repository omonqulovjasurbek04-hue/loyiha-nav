import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { Queue } from '../../queues/entities/queue.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  org_id: string;

  @Column()
  name: string;

  @Column({ default: 15 })
  duration_minutes: number;

  @Column({ nullable: true })
  daily_limit: number;

  @Column({ default: true })
  is_active: boolean;

  // Relations
  @ManyToOne(() => Organization, (org) => org.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'org_id' })
  organization: Organization;

  @OneToMany(() => Queue, (queue) => queue.service)
  queues: Queue[];

  @CreateDateColumn()
  created_at: Date;
}
