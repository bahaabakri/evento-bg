import { Expose, Type } from "class-transformer";
import { EventDto } from "./event.dto";

export class PaginatedEventsDto {
  @Expose()
  @Type(() => EventDto)
  data: EventDto[];

  @Expose()
  meta: {
    total: number;
    page: number;
    perPage: number;
  };
}