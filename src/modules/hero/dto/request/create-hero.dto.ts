import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateHeroDto {
  @ApiProperty({
    type: String,
    isArray: true,
    example: ['1', '2', '3'],
    description: 'Event images Ids',
  })
  @IsString({ each: true })
  imagesIds: string[];
}
