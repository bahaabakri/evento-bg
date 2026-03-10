import { Expose, Transform } from 'class-transformer';
import { User } from '@/modules/users/user.entity';
import { ImageObject } from '@/types/types';
import { Type } from 'class-transformer';
import { UserDto } from '@/modules/users/dto/response/user.dto';
import { PlanDto } from '@/modules/plans/dto/response/plan.dto';
import { TicketDto } from '@/modules/tickets/dto/response/tickets.dto';

export class EventDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  date: string;

  @Expose()
  location: string;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  isActive: boolean;

  @Expose()
  isApproved: boolean;

  @Expose()
  images: ImageObject[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => UserDto)
  createdBy: UserDto;

  @Expose()
  @Type(() => TicketDto)
  tickets: TicketDto[];

  @Expose()
  @Type(() => PlanDto)
  plans: PlanDto[];

  @Expose()
  isFavorite?: boolean;
}
