import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export default class SearchUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 255)
  query: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  perPage: number;
}
