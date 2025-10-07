import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsISO8601,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export default class CreateEventDto {
  @IsString()
  @Length(3, 255)
  @ApiProperty({ description: 'Name of the event' })
  name: string;

  @IsString()
  @Length(5, 255)
  @ApiProperty({ description: 'Event description' })
  description: string;

  @IsString()
  @IsISO8601()
  @ApiProperty({ description: 'Date of the event in ISO format' })
  date: string;

  @IsString()
  @Length(3, 255)
  @ApiProperty({ description: 'The location of the event' })
  location: string;

  @IsLongitude()
  @ApiProperty({ description: 'Longutite' })
  lng: number;

  @IsLatitude()
  @ApiProperty({ description: 'Latituite' })
  lat: number;

  @IsString({ each: true })
  @ApiProperty({ description: 'Array of images Ids' })
  imagesIds: string[];
}
