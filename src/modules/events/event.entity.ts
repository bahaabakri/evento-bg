import { ImageObject } from 'src/types/types';
import { User } from '../users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UserEvent } from '../user-events/user-events.entity';
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

  @ManyToOne(() => User, (user) => user.createdEvents, { onDelete: 'CASCADE' })
  createdBy: User;

  @OneToMany(() => UserEvent, (userEvent) => userEvent.event)
  joinedUsers: UserEvent[];
}
