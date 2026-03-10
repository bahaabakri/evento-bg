import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { EventEntity } from '../events/entities/event.entity';
import { TicketStatus } from './enums/ticket-status.enum';
import { PlanEntity } from '../plans/plan.entity';

@Entity('tickets')
export class EventTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tickets, {
    eager: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => EventEntity, (event) => event.tickets, {
    eager: false,
    onDelete: 'CASCADE',
  })
  event: EventEntity;

  /**
   * Unique ticket code (used for QR generation / lookup)
   */
  @Column({ type: 'varchar', length: 128, unique: true })
  code: string;

  /**
   * Ticket status
   */
  @Column({
    default: TicketStatus.RESERVED,
  })
  status: TicketStatus;

  /** Optional QR code data URL or link to the generated QR image */
  @Column({ type: 'text', nullable: true })
  qrCodeUrl: string | null;

  /** when the reservation ends up */
  @Column({ type: 'datetime', nullable: true })
  reservationExpiresAt: Date | null;

  /** When the ticket was paid/purchased */
  @Column({ type: 'datetime', nullable: true })
  purchasedAt: Date | null;

  /** When the ticket was checked in (scanned) */
  @Column({ type: 'datetime', nullable: true })
  checkedInAt: Date | null;

  @Index()
  @Column({ type: 'text', nullable: true })
  stripePaymentIntentId: string | null;

  @Column({ type: 'text', nullable: true })
  stripeClientSecret: string | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @ManyToOne(() => PlanEntity, (plan) => plan.tickets, { eager: false })
  plan: PlanEntity;
}
