import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Service } from './service.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string; // masalan: bank, soliq, pension

  @Column()
  address: string;

  @Column({ nullable: true })
  district_id: number;

  @Column({ default: '09:00-18:00' })
  working_hours: string;

  @Column({ default: true })
  is_active: boolean;

  // Relations
  @OneToMany(() => Service, (service) => service.organization)
  services: Service[];
}
