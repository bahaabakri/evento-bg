import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @MinLength(2, { message: 'Firstname must be at least 2 characters' })
  @IsNotEmpty({ message: 'Firstname is required' })
  firstname: string;

  @IsString()
  @MinLength(2, { message: 'Lastname must be at least 2 characters' })
  @IsNotEmpty({ message: 'Lastname is required' })
  lastname: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  // optional: regex for international phone validation
  @Matches(/^\+?[1-9]\d{6,14}$/, {
    message: 'Phone number is not valid',
  })
  phone: string;
}
