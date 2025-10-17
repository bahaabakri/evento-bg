import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Length } from "class-validator";

export class SearchPlanDto {
      @ApiProperty({
        example: 2,
        description: 'Event id',
      })
      @IsNumber()
      @Type(() => Number)
      eventId: number;

      @ApiPropertyOptional({
        example: 'My Plan',
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
        description: 'Number of plans in one page',
      })
      @IsOptional()
      @Type(() => Number)
      @IsNumber()
      perPage: number;
}
