import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({
    example: 3,
    description: 'Number of tickets sdsdf',
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    example: 'Gold',
    description: 'Ticket type',
  })
  @IsOptional()
  @IsString()
  ticketType?: string;

  @ApiProperty({
    example: 32.34,
    description: 'Ticket price',
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    example: 'USD',
    description: 'Ticket currency',
  })
  @IsOptional()
  @IsString()
  currency?: string;
}
