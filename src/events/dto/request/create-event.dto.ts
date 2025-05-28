import { IsBoolean, IsISO8601, IsLatitude, IsLongitude, IsNumber, IsString, Length } from "class-validator";

export default class CreateEventDto {
    @IsString()
    @Length(3, 255)
    name: string;

    @IsString()
    @Length(5, 255)
    description: string;

    @IsString()
    @IsISO8601()
    date: string;
    
    @IsString()
    @Length(3, 255)
    location: string;

    @IsLongitude()
    lng:number;

    @IsLatitude()
    lat: number;

    @IsString({each: true})
    imagesIds: string[];
}