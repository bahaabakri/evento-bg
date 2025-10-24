import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThan } from 'typeorm';
import { EventEntity } from '../events/event.entity';
import { User } from '../users/user.entity';
import { EventTicket } from './ticket.entity';
import { v4 as uuidv4 } from 'uuid';
import { TicketStatus } from './enums/ticket-status.enum';
import SearchTicketDto from './dto/request/search-ticket.dto';
import { PaginatedResult } from '@/types/types';
import { TicketFilters } from './tickets.type';
import { JoinEventDto } from './dto/request/join-event.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PlansService } from '../plans/plans.service';
import { validateId } from '@/util';
const TIME_TO_FREE_UP_RESERVED_TICKET_IN_MIN = 15; // 15 minutes
@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);
  constructor(
    @InjectRepository(EventTicket)
    private readonly ticketRepo: Repository<EventTicket>,
    private readonly dataSource: DataSource,
    private readonly plansService: PlansService,
  ) {}

  /**
   * Join event / purchase tickets
   * @param user
   * @param dto
   * @returns
   */
  async joinEvent(user: User, dto: JoinEventDto) {
    // we use transaction dataSource to avoid race conditions
    return await this.dataSource.transaction(async (manager) => {
      // get event with plans
      const event = await manager.findOne(EventEntity, {
        where: { id: dto.eventId },
        relations: ['plans'],
      });
      // event not found
      if (!event) throw new NotFoundException('Event not found');

      const createdTickets: EventTicket[] = [];
      // loop through plans
      for (const { planId, quantity } of dto.plans) {
        // in case any plan not exist in event throw error
        const plan = event.plans.find((p) => p.id === planId);
        if (!plan)
          throw new BadRequestException(
            `Plan ${planId} does not belong to this event`,
          );

        // check capacity
        // get the count of (sold / reserved) tickets for this plan in DB
        const soldCount = await manager.count(EventTicket, {
          where: [
            { plan: { id: planId }, status: TicketStatus.RESERVED },
            { plan: { id: planId }, status: TicketStatus.PAID },
          ],
        });
        // in case sold tickets + requested quantity > plan capacity throw error
        if (soldCount + quantity > plan.capacity) {
          throw new BadRequestException(
            `Not enough tickets available for plan ${plan.name}`,
          );
        }
        // update plan soldSeats
        this.plansService.updatePlanCapacity(plan.id, soldCount + quantity);
        // Create multiple tickets
        for (let i = 0; i < quantity; i++) {
          const ticket = manager.create(EventTicket, {
            user,
            event,
            plan,
            code: `${plan.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            status: TicketStatus.RESERVED,
            reservationExpiresAt: new Date(
              Date.now() + TIME_TO_FREE_UP_RESERVED_TICKET_IN_MIN * 60 * 1000,
            ), // 15 minutes from now
          });

          createdTickets.push(await manager.save(EventTicket, ticket));
        }
      }

      return {
        message: 'Tickets purchased successfully',
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
    const ticket = await this.ticketRepo.findOne({
      where: { id: validateId(id) },
      relations: ['event', 'user'],
    });
    if (!ticket) {
      throw new NotFoundException('Ticket Not Found');
    }
    return ticket;
  }

  ////// CRON JOB TO CANCEL EXPIRED RESERVED TICKETS //////
  // 🕒 This runs automatically every minute
  @Cron(CronExpression.EVERY_MINUTE)
  async cancelExpiredReservations() {
    const now = new Date();
    const expiredTickets = await this.ticketRepo.find({
      where: {
        status: TicketStatus.RESERVED,
        reservationExpiresAt: LessThan(now),
      },
    });

    if (expiredTickets.length === 0) return;
    const result = await this.ticketRepo.update(
      {
        status: TicketStatus.RESERVED,
        reservationExpiresAt: LessThan(now),
      },
      { status: TicketStatus.CANCELLED },
    );

    if (result.affected && result.affected > 0) {
      for (const ticket of expiredTickets) {
        // update plan soldSeats
        this.plansService.updatePlanCapacity(
          ticket.plan.id,
          ticket.plan.soldSeats - 1,
        );
      }
      this.logger.log(
        `CRON JOB: Cancelled ${result.affected} expired reservations`,
      );
    }
  }
}
