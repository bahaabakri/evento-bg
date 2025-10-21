import { Expose } from 'class-transformer';
import { Type } from 'class-transformer';
import { EventDto } from '@/modules/events/dto/response/event.dto';
import { TicketDto } from '@/modules/tickets/dto/response/tickets.dto';

export class PlanDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  currency: string;

  @Expose()
  capacity: number;

  @Expose()
  @Type(() => EventDto)
  event: EventDto;

  @Expose()
  @Type(() => TicketDto)
  tickets: TicketDto[];
}