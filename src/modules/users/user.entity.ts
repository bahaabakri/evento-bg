import { Otp } from '../otp/otp.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './roles.enum';
import { EventEntity } from '../events/event.entity';
import { Status } from './status.enum';
import { EventTicket } from '../tickets/ticket.entity';

@Entity('users')
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

  @OneToMany(() => EventTicket, (ticket) => ticket.user)
  joinedEvents: EventTicket[];

  @CreateDateColumn({default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @UpdateDateColumn({default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;
}
