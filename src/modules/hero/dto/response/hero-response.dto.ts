import { Expose, Type } from "class-transformer";
import { HeroDto } from "./hero.dto";

export class HeroResponseDto {
  @Expose()
  message: string;

  @Expose()
  @Type(() => HeroDto)
  hero: HeroDto;
}