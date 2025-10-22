import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRoleDto {
  @ApiProperty({
    example: 'customer support',
    description: 'Role Name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'This role is for customer support staff',
    description: 'Role Description',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: Number,
    isArray: true,
    example: [1, 2, 3],
    description: 'Role permissions Ids',
  })
  @IsNumber({}, {each: true})
  permissionsIds: number[];
}