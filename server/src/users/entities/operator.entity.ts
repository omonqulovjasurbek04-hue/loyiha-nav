import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { Ticket } from '../../queues/entities/ticket.entity';

export enum OperatorStatus {
  ACTIVE = 'ACTIVE',
  BREAK = 'BREAK',
  OFFLINE = 'OFFLINE',
}

@Entity('operators')
export class Operator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  org_id: string;

  @Column()
  window_number: number;

  @Column({ nullable: true })
  current_ticket_id: string | null;

  @Column({
    type: 'enum',
    enum: OperatorStatus,
    default: OperatorStatus.OFFLINE,
  })
  status: OperatorStatus;

  // Relations
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'org_id' })
  organization: Organization;

  @OneToOne(() => Ticket, { nullable: true })
  @JoinColumn({ name: 'current_ticket_id' })
  current_ticket: Ticket;
}
