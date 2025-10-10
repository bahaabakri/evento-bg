import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class GoogleLoginDto {
  @ApiProperty({
    example: 'xxxxxxx',
    description: 'Google Oauth token after login from front',
  })
  @IsString()
  token: string;
}
