import { MinLengthIfNotEmpty } from '@/decorators/min-length-if-not-empty.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUpdateUserDto {
  @ApiPropertyOptional({
    example: 'John',
    description: '`first name should be more than 2 charachters`',
  })
  @IsOptional()
  @ValidateIf((obj) => obj.firstname?.trim().length > 0) // ✅ only validate if not empty
  @IsString()
  @MinLength(2, { message: 'Firstname must be at least 2 characters' })
  firstname?: string;

  @ApiPropertyOptional({
    example: 'Bakri',
    description: 'lastname should be more than 2 charachters',
  })
  @IsOptional()
  @ValidateIf((obj) => obj.lastname?.trim().length > 0) // ✅ only validate if not empty
  @IsString()
  @MinLength(2, { message: 'Lastname must be at least 2 characters' })
  lastname?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiPropertyOptional({
    example: '+17868768768',
    description: 'User phone number',
  })
  @IsOptional()
  @ValidateIf((obj) => obj.phone?.trim().length > 0) // ✅ only validate if not empty
  @IsString()
  @Matches(/^\+?[1-9]\d{6,14}$/, {
    message: 'Phone number is not valid',
  })
  phone?: string; // allow null
}
