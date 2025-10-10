import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateLoginDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsString()
  @IsEmail()
  email: string;
}
