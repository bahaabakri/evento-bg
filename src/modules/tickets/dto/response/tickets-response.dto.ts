import { Expose, Type } from "class-transformer";
import { TicketsDto } from "./tickets.dto";

export class TicketsResponseDto {
  @Expose()
  message: string;

  @Expose()
  @Type(() => TicketsDto)
  tickets: TicketsDto;
}