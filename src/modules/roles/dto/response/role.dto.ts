import { PermissionDto } from "@/modules/permissions/dto/response/permission.dto";
import { Expose, Type } from "class-transformer";

export class RoleDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    @Type(() => PermissionDto)
    permissions: PermissionDto[]
}