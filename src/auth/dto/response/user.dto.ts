import { Expose, Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNumber, IsString } from "class-validator";
import { Role } from "src/users/roles.enum";

export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    isVerified: boolean;

    @Expose()
    role: Role;
}