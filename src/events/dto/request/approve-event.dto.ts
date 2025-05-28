import { IsBoolean } from "class-validator";

export class ApproveEventDto {
    @IsBoolean()
    approved: boolean;
}