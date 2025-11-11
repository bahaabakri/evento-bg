import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export default class SearchUserDto {
  @ApiPropertyOptional({
    example: 'John',
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
    description: 'Number of users in one page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  perPage: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Role Id',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  roleId?: number;
}
