import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHeroDto {
  @ApiProperty({
    type: Number,
    isArray: true,
    example: [1, 2, 3],
    description: 'Event images Ids',
  })
  @IsNumber({}, { each: true })
  imagesIds: number[];
}
