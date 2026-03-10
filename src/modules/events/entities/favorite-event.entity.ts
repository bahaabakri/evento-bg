import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn } from 'typeorm';
import { EventEntity } from './event.entity';
import { User } from '@/modules/users/user.entity';

@Entity('favorite_events')
@Unique(['user', 'event'])
export class FavoriteEventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favoriteEvents, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => EventEntity, (event) => event.favoritedBy, {
    onDelete: 'CASCADE',
  })
  event: EventEntity;

  @CreateDateColumn()
  createdAt: Date;
}