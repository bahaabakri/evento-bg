import { Otp } from '../otp/otp.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventEntity } from '../events/event.entity';
import { UserStatus } from './user-status.enum';
import { EventTicket } from '../tickets/ticket.entity';
import { Role } from '../roles/role.entity';
import { UserType } from './user-type.enum';

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

  @Column({ default: UserStatus.PENDING })
  status: UserStatus;

  @OneToMany(() => Otp, (otp) => otp.user, { cascade: true })
  otps: Otp[];

  @OneToMany(() => EventEntity, (eventEntity) => eventEntity.createdBy, {
    cascade: true,
    eager: false
  })
  createdEvents: EventEntity[];

  @Column({ default: UserType.USER })
  userType: UserType;

  @OneToMany(() => EventTicket, (ticket) => ticket.user)
  tickets: EventTicket[];

  @CreateDateColumn({default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @UpdateDateColumn({default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.admins, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];
}
