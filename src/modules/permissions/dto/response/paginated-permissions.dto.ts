import { Expose, Type } from "class-transformer";
import { PaginationDto } from "@/shared-dto/pagination.dto";
import { PermissionDto } from "./permission.dto";

export class PaginatedPermissionsDto {
  @Expose()
  @Type(() => PermissionDto)
  data: PermissionDto[];

  @Expose()
  @Type(() => PaginationDto)
  meta: PaginationDto;
}