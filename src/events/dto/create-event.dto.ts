import { IsBoolean, IsISO8601, IsString, Length } from "class-validator";

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

    @IsString()
    isActive: string;
}