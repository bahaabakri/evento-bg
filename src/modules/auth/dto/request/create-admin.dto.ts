import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    example: 'John',
    description: '`first name should be more than 2 charachters`',
  })
  @IsString()
  @MinLength(2, { message: 'Firstname must be at least 2 characters' })
  @IsNotEmpty({ message: 'Firstname is required' })
  firstname: string;

  @ApiProperty({
    example: 'Bakri',
    description: 'lastname should be more than 2 charachters',
  })
  @IsString()
  @MinLength(2, { message: 'Lastname must be at least 2 characters' })
  @IsNotEmpty({ message: 'Lastname is required' })
  lastname: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Admin email address',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: '+17868768768',
    description: 'Admin phone number',
  })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  // optional: regex for international phone validation
  @Matches(/^\+?[1-9]\d{6,14}$/, {
    message: 'Phone number is not valid',
  })
  phone: string;
}
