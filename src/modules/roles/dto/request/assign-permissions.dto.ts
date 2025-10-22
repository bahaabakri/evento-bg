import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class AssignPermissionsToRoleDto {
  @ApiProperty({
    type: Number,
    isArray: true,
    example: [1, 2, 3],
    description: 'Role permissions Ids',
  })
  @IsNumber({}, {each: true})
  permissionsIds: number[];
}