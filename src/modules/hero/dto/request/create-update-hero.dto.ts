import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUpdateHeroDto {
  @ApiProperty({
    type: Number,
    isArray: true,
    example: [1, 2, 3],
    description: 'Event images Ids',
  })
  @IsNumber({}, { each: true })
  imagesIds: number[];

  @ApiProperty({
    type: String,
    example: 'Hero Name',
    description: 'Name of the hero',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'Hero Title',
    description: 'Title of the hero',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    example: 'Hero Description',
    description: 'Description of the hero',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Is the hero active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
