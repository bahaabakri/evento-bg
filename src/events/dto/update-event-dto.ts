import { IsBoolean, IsISO8601, IsNumber, IsOptional, IsString, Length } from "class-validator";

export default class UpdateEventDto {
    @IsOptional()
    @IsString()
    @Length(3, 255)
    name: string;

    @IsOptional()
    @IsString()
    @Length(5, 255)
    description: string;

    @IsOptional()
    @IsString()
    @IsISO8601()
    date: string;
    
    @IsOptional()
    @IsString()
    @Length(3, 255)
    location: string;

    @IsOptional()
    @IsString({each: true})
    imagesIds: string[];
}