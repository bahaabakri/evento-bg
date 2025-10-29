import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUpdateAdminDto {
  @ApiProperty({
    example: 'John',
    description: '`first name should be more than 2 charachters`',
  })
  @IsString()
  @MinLength(2, { message: 'Firstname must be at least 2 characters' })
  firstname: string;

  @ApiProperty({
    example: 'Bakri',
    description: 'lastname should be more than 2 charachters',
  })
  @IsString()
  @MinLength(2, { message: 'Lastname must be at least 2 characters' })
  lastname: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: '+17868768768',
    description: 'User phone number',
  })
  @IsString()
  @Matches(/^\+?[1-9]\d{6,14}$/, {
    message: 'Phone number is not valid',
  })
  phone: string; // allow null
}
