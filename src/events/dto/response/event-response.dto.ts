import { Expose, Type } from "class-transformer";
import { EventDto } from "./event.dto";

export class EventResponseDto {
  @Expose()
  message: string;

  @Expose()
  @Type(() => EventDto)
  event: EventDto;
}