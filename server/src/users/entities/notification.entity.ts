import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Ticket } from '../../queues/entities/ticket.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column({ nullable: true })
  ticket_id: string;

  @Column()
  type: string; // Masalan: 'SMS', 'PUSH', 'SYSTEM'

  @Column('text')
  message: string;

  @CreateDateColumn()
  sent_at: Date;

  @Column({ default: false })
  is_read: boolean;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Ticket, { nullable: true })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;
}
