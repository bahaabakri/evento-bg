import { Expose, Type } from "class-transformer";
import { TicketDto } from "./tickets.dto";

export class TicketsResponseDto {
  @Expose()
  message: string;

  @Expose()
  @Type(() => TicketDto)
  tickets: TicketDto;

  @Expose()
  clientSecret: string | null;
}