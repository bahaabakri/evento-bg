import { Otp } from '../otp/otp.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './roles.enum';
import { EventEntity } from '../events/event.entity';
import { Status } from './status.enum';
import { UserEvent } from '../user-events/user-events.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: Role.USER })
  role: Role;

  @Column({ default: Status.PENDING })
  status: Status;

  @OneToMany(() => Otp, (otp) => otp.user, { cascade: true })
  otps: Otp[];

  @OneToMany(() => EventEntity, (eventEntity) => eventEntity.createdBy, {
    cascade: true,
  })
  createdEvents: EventEntity[];

  @OneToMany(() => UserEvent, (userEvent) => userEvent.user)
  joinedEvents: UserEvent[];
}
