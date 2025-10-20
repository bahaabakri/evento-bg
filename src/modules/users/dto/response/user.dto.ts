import { Expose, Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNumber, IsString } from "class-validator";
import { Role } from "src/modules/users/roles.enum";

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

    @Expose()
    role: Role;
}