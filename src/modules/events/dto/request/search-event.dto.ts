import { ToBoolean } from '@/decorators/to-boolean.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  Length,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';

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

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the event is a favorite',
  })
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  favorite?: boolean;
}
