import { Expose, Type } from "class-transformer";
import { PaginationDto } from "@/shared-dto/pagination.dto";
import { TicketsDto } from "./tickets.dto";

export class PaginatedTicketsDto {
  @Expose()
  @Type(() => TicketsDto)
  data: TicketsDto[];

  @Expose()
  @Type(() => PaginationDto)
  meta: PaginationDto;
}