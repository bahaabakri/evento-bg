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

    // @Expose()
    // @Type(() => RoleDto)
    // roles: RoleDto[]
}