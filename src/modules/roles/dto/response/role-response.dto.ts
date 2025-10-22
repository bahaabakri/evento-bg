import { Expose, Type } from "class-transformer";
import { RoleDto } from "./role.dto";

export class RoleResponseDto {
  @Expose()
  message: string;

  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;
}