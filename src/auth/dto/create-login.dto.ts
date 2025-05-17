import { IsEmail, IsString } from "class-validator";
import { Role } from "src/users/roles.enum";

export class CreateLoginDto {
    @IsString()
    @IsEmail()
    email:string;
}