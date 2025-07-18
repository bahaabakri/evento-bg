import { Type } from "class-transformer";
import { IsString, Length, IsOptional, IsNumber } from "class-validator";

export default class SearchEventDto {
    @IsOptional()
    @IsString()
    @Length(3, 255)
    query: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    perPage: number;
}