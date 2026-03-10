import { ImageObject } from 'src/types/types';
import { User } from '../../users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { EventTicket } from '../../tickets/ticket.entity';
import { PlanEntity } from '../../plans/plan.entity';
import { FavoriteEventEntity } from './favorite-event.entity';
@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  date: string;

  @Column()
  location: string;

  @Column({ type: 'float', nullable: true, default: null })
  lng: number;

  @Column({ type: 'float', nullable: true, default: null })
  lat: number;

  @Column()
  isActive: boolean;

  @Column({ default: false })
  isApproved: boolean;

  @Column({
    type: 'text', // or 'json' / 'jsonb' if using Postgres
    nullable: true,
    transformer: {
      to: (value: ImageObject[]) => JSON.stringify(value),
      from: (value: string) => JSON.parse(value),
    },
  })
  images: ImageObject[];

  @ManyToOne(() => User, (user) => user.createdEvents, {
    eager: false,
    onDelete: 'CASCADE',
  })
  createdBy: User;

  @OneToMany(() => EventTicket, (ticket) => ticket.event, { eager: false })
  tickets: EventTicket[];

  @OneToMany(() => PlanEntity, (plan) => plan.event, {
    cascade: true,
    eager: false,
  })
  plans: PlanEntity[];

  @OneToMany(() => FavoriteEventEntity, (favorite) => favorite.event)
  favoritedBy: FavoriteEventEntity[];
}
