import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateHeroDto {
    @IsString({each: true})
    imagesIds: string[];
}