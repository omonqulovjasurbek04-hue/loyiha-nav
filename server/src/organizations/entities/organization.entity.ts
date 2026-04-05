import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Service } from './service.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  district_id: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: '09:00-18:00' })
  working_hours: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Service, (service) => service.organization)
  services: Service[];
}
