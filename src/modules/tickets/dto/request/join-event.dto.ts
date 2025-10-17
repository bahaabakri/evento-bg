import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsNumber, ValidateNested } from 'class-validator';

class PlanQuantity {
  @ApiProperty({ example: 1, description: 'Plan ID' })
  @IsNumber()
  @Type(() => Number)
  planId: number;

  @ApiProperty({ example: 2, description: 'Number of tickets to buy for this plan' })
  @IsInt()
  quantity: number;
}

export class JoinEventDto {
  @ApiProperty({ example: 2, description: 'Event ID' })
  @IsNumber()
  @Type(() => Number)
  eventId: number;

  @ApiProperty({
    type: [PlanQuantity],
    description: 'List of plans and quantities to purchase',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PlanQuantity)
  plans: PlanQuantity[];
}
