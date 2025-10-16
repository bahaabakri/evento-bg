import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { EventEntity } from '../events/event.entity';
import { TicketStatus } from './enums/ticket-status.enum';

@Entity('tickets')
export class EventTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.joinedEvents, { eager: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => EventEntity, (event) => event.joinedUsers, { onDelete: 'CASCADE' })
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
    default: TicketStatus.RESERVED
  })
  status: TicketStatus;

  /** Price paid for this ticket (nullable for free tickets) */
  @Column({ type: 'float', nullable: true })
  price: number | null;

  /** Currency code for the price (e.g. USD, EUR) */
  @Column({ type: 'varchar', length: 8, nullable: true })
  currency: string | null;

  /** Optional ticket category/type (VIP, General, etc.) */
  @Column({ type: 'varchar', length: 100, nullable: true })
  ticketType: string | null;

  /** Optional QR code data URL or link to the generated QR image */
  @Column({ type: 'text', nullable: true })
  qrCodeUrl: string | null;

  /** When the ticket was paid/purchased */
  @Column({ type: 'datetime', nullable: true })
  purchasedAt: Date | null;

  /** When the ticket was checked in (scanned) */
  @Column({ type: 'datetime', nullable: true })
  checkedInAt: Date | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
