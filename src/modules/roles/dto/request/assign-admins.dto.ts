import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class AssignAdminsToRoleDto {
      @ApiProperty({
        type: Number,
        isArray: true,
        example: [1, 2, 3],
        description: 'Admins Ids',
      })
      @IsNumber({},{ each: true })
      adminsIds: number[];
}