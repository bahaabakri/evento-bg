// plan.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { EventEntity } from '../events/event.entity';
import { EventTicket } from '../tickets/ticket.entity';

@Entity('plans')
export class PlanEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('float')
  price: number;

  @Column('int')
  capacity: number;

  @Column('int', { default: 0 })
  availableSeats: number;

  @Column('int', { default: 0 })
  soldSeats: number;

  @Column({default: null})
  currency: string;

  @ManyToOne(() => EventEntity, (event) => event.plans, { eager: false, nullable: true, onDelete: 'CASCADE' })
  event: EventEntity | null;

  @OneToMany(() => EventTicket, (ticket) => ticket.plan, {eager: false})
  tickets: EventTicket[];
}
