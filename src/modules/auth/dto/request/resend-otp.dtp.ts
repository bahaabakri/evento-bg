import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ResendOtpDto {
      @ApiProperty({
        example: 'john@example.com',
        description: 'Admin email address',
      })
      @IsEmail({}, { message: 'Invalid email format' })
      @IsNotEmpty({ message: 'Email is required' })
      email: string;
}