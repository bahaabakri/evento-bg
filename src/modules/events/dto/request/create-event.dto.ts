import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export default class CreateEventDto {
  @ApiProperty({
    example: 'My Event',
    description: 'Event name should be between 3 to 255 characters',
  })
  @IsString()
  @Length(3, 255)
  name: string;

  @ApiProperty({
    example: 'My Event description',
    description: 'Event description should be between 5 to 255 characters',
  })
  @IsString()
  @Length(5, 255)
  description: string;

  @ApiProperty({
    example: '2025-10-10T12:34:56Z',
    description: 'Event Date in Iso format (UTC)',
  })
  @IsString()
  @IsISO8601()
  date: string;

  @ApiProperty({
    example: 'USA - Newyork',
    description: 'Event location should be between 3 to 255 characters',
  })
  @IsString()
  @Length(3, 255)
  location: string;

  @ApiProperty({
    example: '32.34',
    description: 'Event location longitude',
  })
  @IsLongitude()
  lng: number;

  @ApiProperty({
    example: '-24.42',
    description: 'Event location latitude',
  })
  @IsLatitude()
  lat: number;
  
  @ApiProperty({
    type: Number,
    isArray: true,
    example: [1, 2, 3],
    description: 'Event images Ids'
  })
  @IsNumber({}, { each: true })
  imagesIds: number[];
}
