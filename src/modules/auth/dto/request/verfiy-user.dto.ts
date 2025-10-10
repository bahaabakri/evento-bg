import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class VerifyUserDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '000000',
    description: 'Otp code',
  })
  @IsString()
  otp: string;
}
