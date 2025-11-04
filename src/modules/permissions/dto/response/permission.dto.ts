import { RoleDto } from "@/modules/roles/dto/response/role.dto";
import { Expose, Type } from "class-transformer";

export class PermissionDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    slug: string;

    @Expose()
    module: string

    @Expose()
    action: string

    @Expose()
    @Type(() => RoleDto)
    roles: RoleDto[]
}