import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { EventEntity } from '../events/event.entity';
import { User } from '../users/user.entity';
import { EventTicket } from './ticket.entity';
import { CreateTicketDto } from './dto/request/create-ticket.dto';
import { v4 as uuidv4 } from 'uuid';
import { TicketStatus } from './enums/ticket-status.enum';
import SearchTicketDto from './dto/request/search-ticket.dto';
import { PaginatedResult } from '@/types/types';
import { TicketFilters } from './ticket.type';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(EventTicket)
    private readonly ticketRepo: Repository<EventTicket>,
    @InjectRepository(EventEntity)
    private readonly eventRepo: Repository<EventEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async joinEvent(
    user: User,
    eventId: number,
    body: CreateTicketDto,
  ): Promise<{ message: string; tickets: EventTicket[] }> {
    // Use a transaction to avoid race conditions on capacity
    return await this.dataSource.transaction(async (manager) => {
      const event = await manager.findOne(EventEntity, {
        where: { id: eventId },
        relations: ['createdBy'],
      });
      if (!event) throw new NotFoundException('Event not found');

      // Basic checks
      if (!event.isActive) throw new BadRequestException('Event is not active');
      if (!event.isApproved) throw new BadRequestException('Event is not approved');

      // Prevent joining past events - assume event.date is ISO string
      const eventDate = new Date(event.date);
      const now = new Date();
      if (!isNaN(eventDate.getTime()) && eventDate < now)
        throw new BadRequestException('Cannot join past events');

      // Quantity and ticket info
      const quantity = body?.quantity && body.quantity > 0 ? body.quantity : 1;

      // Capacity check (if capacity set)
      if (typeof event.capacity === 'number' && event.capacity !== null) {
        // Count current tickets inside transaction
        const count = await manager.count(EventTicket, {
          where: { event: { id: eventId } },
        });
        if (count + quantity > event.capacity)
          throw new ConflictException('Event capacity reached');
      }

      const createdTickets: EventTicket[] = [];
      for (let i = 0; i < quantity; i++) {
        const code = uuidv4();

        const priceProvided = typeof body?.price === 'number' && !isNaN(body.price);
        const isPaid = priceProvided && (body.price ?? 0) > 0;

        const ticketData: Partial<EventTicket> = {
          user,
          event,
          code,
          ticketType: body?.ticketType ?? null,
          price: priceProvided ? body.price : null,
          currency: body?.currency ?? null,
          status: isPaid ? TicketStatus.PAID : TicketStatus.RESERVED,
          purchasedAt: isPaid ? new Date() : null,
        } as Partial<EventTicket>;

        const ticket = manager.create(EventTicket, ticketData);
        await manager.save(ticket);
        const full = await manager.findOne(EventTicket, {
          where: { id: ticket.id },
          relations: { user: true, event: { createdBy: true } },
        });
        if (full) createdTickets.push(full);
      }

      return {
        message: 'Tickets created successfully',
        tickets: createdTickets,
      };
    });
  }


/** Generic function to fetch tickets with optional filters */
  async getTickets(
    filters: TicketFilters & SearchTicketDto,
  ): Promise<PaginatedResult<EventTicket>> {
    const { page = 1, perPage = 10, userId, eventId } = filters;
    const skip = (page - 1) * perPage;

    const where: any = {};
    if (userId) where.user = { id: userId };
    if (eventId) where.event = { id: eventId };

    const [tickets, total] = await this.ticketRepo.findAndCount({
      where,
      skip,
      take: perPage,
      order: { createdAt: 'DESC' },
      relations: ['event', 'user'],
    });

    return {
      data: tickets,
      meta: { total, page, perPage },
    };
  }


  /** Get ticket by ticket id */
  async getTicketById(id: number): Promise<EventTicket> {
    if (!id) {
      throw new NotFoundException('Ticket Not Found');
    }
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: ['event', 'user'],
    });
    if (!ticket) {
      throw new NotFoundException('Ticket Not Found');
    }
    return ticket;
  }
}
