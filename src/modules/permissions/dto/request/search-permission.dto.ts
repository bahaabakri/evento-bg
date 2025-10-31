import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Length, ValidateIf } from "class-validator";

export class SearchPermissionDto {
      @ApiPropertyOptional({
        example: 'My Permission',
        description: 'Query for search should be between 3 to 255 characters',
      })
      @ValidateIf((obj) => obj.query?.trim().length > 0) // ✅ only validate if not empty
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
        description: 'Number of permissions in one page',
      })
      @IsOptional()
      @Type(() => Number)
      @IsNumber()
      perPage: number;
}
