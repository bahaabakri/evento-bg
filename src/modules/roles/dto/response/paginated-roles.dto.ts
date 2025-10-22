import { PaginationDto } from "@/shared-dto/pagination.dto";
import { Expose, Type } from "class-transformer";
import { RoleDto } from "./role.dto";

export class PaginatedRolesDto {
  @Expose()
  @Type(() => RoleDto)
  data: RoleDto[];

  @Expose()
  @Type(() => PaginationDto)
  meta: PaginationDto;
}