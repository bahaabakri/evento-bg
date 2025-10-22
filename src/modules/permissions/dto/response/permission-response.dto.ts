import { Expose, Type } from "class-transformer";
import { PermissionDto } from "./permission.dto";

export class PermissionResponseDto {
  @Expose()
  message: string;

  @Expose()
  @Type(() => PermissionDto)
  permission: PermissionDto;
}