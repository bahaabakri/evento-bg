import { UserDto } from "@/modules/users/dto/response/user.dto";
import { Expose, Type } from "class-transformer";

export class AuthResponseDto {
  @Expose()
  message: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  access_token:string
}