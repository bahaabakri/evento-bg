import { Expose, Type } from "class-transformer";
import { HeroDto } from "./hero.dto";

export class PaginatedHerosDto {
  @Expose()
  @Type(() => HeroDto)
  data: HeroDto[];

  @Expose()
  meta: {
    total: number;
    page: number;
    perPage: number;
  };
}