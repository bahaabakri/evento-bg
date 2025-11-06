import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class AssignRolesToAdminDto {
      @ApiProperty({
        type: Number,
        isArray: true,
        example: [1, 2, 3],
        description: 'Roles Ids',
      })
      @IsNumber({},{ each: true })
      rolesIds: number[];
}