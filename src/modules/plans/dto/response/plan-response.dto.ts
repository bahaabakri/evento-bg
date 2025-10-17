import { Expose, Type } from "class-transformer";
import { PlanDto } from "./plan.dto";

export class PlanResponseDto {
  @Expose()
  message: string;

  @Expose()
  @Type(() => PlanDto)
  plan: PlanDto;
} 