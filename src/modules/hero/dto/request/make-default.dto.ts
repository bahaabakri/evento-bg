import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class MakeDefaultDto {
  @ApiProperty({
    example: true,
    description: 'Your desired status ',
  })
  @IsBoolean()
  isActive: boolean;
}
