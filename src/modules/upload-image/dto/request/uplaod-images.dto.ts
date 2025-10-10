import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class UploadImagesDto {
  @IsString()
  key: string;
}
