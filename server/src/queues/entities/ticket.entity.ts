import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Queue } from './queue.entity';

export enum TicketStatus {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  CANCELLED = 'CANCELLED',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  queue_id: string;

  @Column()
  user_id: string;

  @Column({ type: 'int' })
  ticket_number: number; // Masalan: 12

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.WAITING,
  })
  status: TicketStatus;

  @CreateDateColumn()
  issued_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  called_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  @Column({ type: 'int', nullable: true })
  window_number: number;

  // Relations
  @ManyToOne(() => Queue, (queue) => queue.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'queue_id' })
  queue: Queue;

  @ManyToOne(() => User, (user) => user.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
