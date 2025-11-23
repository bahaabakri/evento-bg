import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsString, Length } from 'class-validator';

export class CreateUpdatePlanDto {
  @ApiProperty({
    example: 'My Plan',
    description: 'Plan name should be between 3 to 255 characters',
  })
  @IsString()
  @Length(3, 255)
  name: string;

  @ApiProperty({
    example: 'My Plan description',
    description: 'Plan description should be between 3 to 255 characters',
  })
  @IsString()
  @Length(3, 255)
  description: string;

  @ApiProperty({
    example: 33.33,
    description: 'Plan price',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'USD',
    description: 'Plan currency',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    example: 100,
    description: 'Plan capacity should be an integer',
  })
  @IsInt()
  capacity: number;

  @ApiProperty({
    example: 2,
    description: 'Event id',
  })
  @IsNumber()
  @Type(() => Number)
  eventId: number;
}
