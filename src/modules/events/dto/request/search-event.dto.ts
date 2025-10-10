import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, Length, IsOptional, IsNumber } from 'class-validator';

export default class SearchEventDto {
  @ApiPropertyOptional({
    example: 'My Event',
    description: 'Query for search should be between 3 to 255 characters',
  })
  @IsOptional()
  @IsString()
  @Length(3, 255)
  query: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'Page number',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number;

  @ApiPropertyOptional({
    example: '10',
    description: 'Number of events in one page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  perPage: number;
}
