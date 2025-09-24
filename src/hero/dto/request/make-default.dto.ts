import { IsBoolean } from "class-validator";

export class MakeDefaultDto {
    @IsBoolean()
    isActive:boolean;
}