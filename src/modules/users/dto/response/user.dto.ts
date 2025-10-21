import { Expose } from "class-transformer";
export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    firstname: string;

    @Expose()
    lastname: string;

    @Expose()
    phone: string;

    @Expose()
    status: string;
    
    @Expose()
    isVerified: boolean;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    // @Expose()
    // @Type(() => RoleDto)
    // roles: Role[];
}