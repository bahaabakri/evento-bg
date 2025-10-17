import { Expose, Transform } from 'class-transformer';
import { User } from '@/modules/users/user.entity';
import { ImageObject } from '@/types/types';
import { Type } from 'class-transformer';
import { UserDto } from '@/modules/users/dto/response/user.dto';
import { TicketsDto } from '@/modules/tickets/dto/response/tickets.dto';
import { PlanDto } from '@/modules/plans/dto/response/plan.dto';

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
  @Type(() => TicketsDto)
  joinedUsers: TicketsDto[];

  @Expose()
  @Type(() => PlanDto)
  plans: PlanDto[];
}
