import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../users/user.entity';
import { EventEntity } from '../events/event.entity';

@Entity('user_events')
@Unique(['user', 'event']) // prevent the same user joining twice
export class UserEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.joinedEvents, {eager: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => EventEntity, (event) =>  event.joinedUsers,{ onDelete: 'CASCADE' })
  event: EventEntity;
}
