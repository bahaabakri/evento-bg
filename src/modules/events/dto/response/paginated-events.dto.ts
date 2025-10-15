import { Expose, Type } from "class-transformer";
import { EventDto } from "./event.dto";
import { PaginationDto } from "@/shared-dto/pagination.dto";

export class PaginatedEventsDto {
  @Expose()
  @Type(() => EventDto)
  data: EventDto[];

  @Expose()
  @Type(() => PaginationDto)
  meta: PaginationDto;
}