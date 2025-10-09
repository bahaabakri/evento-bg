import { Expose, Type } from "class-transformer";
import { UserEventsDto } from "./user-events.dto";

export class UserEventsResponseDto {
  @Expose()
  message: string;

  @Expose()
  @Type(() => UserEventsDto)
  userEvent: UserEventsDto;
}