import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { Service } from '../../organizations/entities/service.entity';
import { Ticket } from './ticket.entity';

@Entity('queues')
export class Queue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  service_id: string;

  @Index()
  @Column({ type: 'date' })
  date: Date;

  @Column({ default: 0 })
  current_number: number; // Ayni vaqtda xizmat ko'rsatilayotgan raqam

  @Column({ default: 0 })
  total_issued: number; // Shu kungacha berilgan umumiy chiptalar soni

  // Relations
  @ManyToOne(() => Service, (service) => service.queues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @OneToMany(() => Ticket, (ticket) => ticket.queue)
  tickets: Ticket[];
}
