import { Transform } from "class-transformer";
import { IsString, Length, IsISO8601, IsLongitude, IsLatitude, IsOptional } from "class-validator";

export default class SearchEventDto {
    @IsOptional()
    @IsString()
    @Length(3, 255)
    name: string;

    @IsOptional()
    @IsString()
    @IsISO8601()
    date: string;

    @IsOptional()
    @IsString()
    @Length(3, 255)
    location: string;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsLongitude()
    lng:number;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsLatitude()
    lat: number;
}