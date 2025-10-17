import { Expose, Type } from "class-transformer";
import { PaginationDto } from "@/shared-dto/pagination.dto";
import { PlanDto } from "./plan.dto";
import { EventDto } from "@/modules/events/dto/response/event.dto";

export class PaginatedPlansDto {
  @Expose()
  @Type(() => PlanDto)
  data: PlanDto[];

  @Expose()
  @Type(() => PaginationDto)
  meta: PaginationDto;
}