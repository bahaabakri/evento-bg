import { Expose, Transform } from 'class-transformer';
import { UserDto } from 'src/modules/users/dto/response/user.dto';
import { User } from 'src/modules/users/user.entity';
import { ImageObject } from 'src/types/types';
import { Type } from 'class-transformer';
import { EventDto } from 'src/modules/events/dto/response/event.dto';

export class TicketsDto {
  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => EventDto)
  event: EventDto;
}
