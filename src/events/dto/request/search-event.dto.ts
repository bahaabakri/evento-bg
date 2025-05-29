import { Transform } from "class-transformer";
import { IsString, Length, IsOptional } from "class-validator";

export default class SearchEventDto {
    @IsOptional()
    @IsString()
    @Length(3, 255)
    query: string;
}