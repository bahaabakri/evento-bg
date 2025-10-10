import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ApproveEventDto {
  @ApiProperty({
    example: true,
    description: 'Your desired status ',
  })
  @IsBoolean()
  approved: boolean;
}
