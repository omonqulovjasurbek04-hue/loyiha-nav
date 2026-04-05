import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Index } from 'typeorm';
import { Ticket } from '../../queues/entities/ticket.entity';

export enum UserRole {
  CITIZEN = 'citizen',
  OPERATOR = 'operator',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  passport_series: string;

  @Column({ type: 'date', nullable: true })
  birth_date: Date;

  @Index()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CITIZEN,
  })
  role: UserRole;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true, select: false })
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];
}
