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

  @Column({default: null})
  currency: string;

  @ManyToOne(() => EventEntity, (event) => event.plans, { onDelete: 'CASCADE' })
  event: EventEntity;

  @OneToMany(() => EventTicket, (ticket) => ticket.plan)
  tickets: EventTicket[];
}
