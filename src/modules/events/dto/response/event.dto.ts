import { Expose, Transform } from 'class-transformer';
import { User } from 'src/modules/users/user.entity';
import { ImageObject } from 'src/types/types';
import { Type } from 'class-transformer';
import { UserEventsDto } from 'src/modules/user-events/dto/response/user-events.dto';
import { UserDto } from 'src/modules/users/dto/response/user.dto';

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
  @Type(() => UserEventsDto)
  joinedUsers: UserEventsDto[];
}
