import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RejectAdminDto {
  @ApiProperty({
    example: 'not verified data ',
    description: 'Reason of rejection',
  })
  @IsString()
  reason: string;
}
