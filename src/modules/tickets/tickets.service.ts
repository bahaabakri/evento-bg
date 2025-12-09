import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThan, In } from 'typeorm';
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
import { StripeService } from '../stripe/stripe.service';
import { ConfigService } from '@nestjs/config';
const TIME_TO_FREE_UP_RESERVED_TICKET_IN_MIN = 15; // 15 minutes
@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);
  constructor(
    @InjectRepository(EventTicket)
    private readonly ticketRepo: Repository<EventTicket>,
    private readonly dataSource: DataSource,
    private readonly plansService: PlansService,
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Join event / purchase tickets
   * @param user
   * @param dto
   * @returns
   */
  async joinEvent(user: User, dto: JoinEventDto) {
    return await this.dataSource.transaction(async (manager) => {
      const event = await manager.findOne(EventEntity, {
        where: { id: dto.eventId },
        relations: ['plans'],
      });

      if (!event) throw new NotFoundException('Event not found');

      const createdTickets: EventTicket[] = [];
      let totalAmount = 0; // in smallest currency unit (ex: cents)

      for (const { planId, quantity } of dto.plans) {
        const plan = event.plans.find((p) => p.id === planId);
        if (!plan)
          throw new BadRequestException(
            `Plan ${planId} does not belong to this event`,
          );

        // check capacity
        const soldCount = await manager.count(EventTicket, {
          where: [
            { plan: { id: planId }, status: TicketStatus.RESERVED },
            { plan: { id: planId }, status: TicketStatus.PAID },
          ],
        });

        if (soldCount + quantity > plan.capacity)
          throw new BadRequestException(`Not enough tickets for ${plan.name}`);

        // update soldSeats
        this.plansService.updatePlanCapacity(plan.id, soldCount + quantity);

        // accumulate amount
        totalAmount += plan.price * quantity * 100; // STRIPE REQUIRES CENTS

        // create tickets
        for (let i = 0; i < quantity; i++) {
          const ticket = manager.create(EventTicket, {
            user,
            event,
            plan,
            code: `${plan.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            status: TicketStatus.RESERVED,
            reservationExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
          });

          createdTickets.push(await manager.save(ticket));
        }
      }

      // ---- STRIPE PAYMENT INTENT ---- //
      const paymentIntent = await this.stripeService.createPaymentIntent(
        totalAmount,
        this.configService.get<string>('CURRENCY') || 'usd',
        {
          tickets: createdTickets.map((t) => t.id).join(','),
          eventId: dto.eventId.toString(),
          userId: user.id.toString(),
        },
      );

      // Save Intent ID + client secret in tickets
      await manager.update(
        EventTicket,
        { id: In(createdTickets.map((t) => t.id)) },
        {
          stripePaymentIntentId: paymentIntent.id,
          stripeClientSecret: paymentIntent.client_secret,
        },
      );

      return {
        message: 'Tickets reserved. Complete your payment.',
        clientSecret: paymentIntent.client_secret,
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
  /** Mark tickets as paid after successful payment */
  async markTicketsAsPaid(ids: number[]) {
    await this.ticketRepo.update(
      { id: In(ids) },
      {
        status: TicketStatus.PAID,
        purchasedAt: new Date(),
      },
    );

    const tickets = await this.ticketRepo.find({
      where: { id: In(ids) },
      relations: ['plan'],
    });

    for (const ticket of tickets) {
      this.plansService.updatePlanCapacity(
        ticket.plan.id,
        ticket.plan.soldSeats + 1,
      );
    }
  }
}
