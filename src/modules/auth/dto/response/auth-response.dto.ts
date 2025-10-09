import { Expose, Type } from "class-transformer";
import { UserDto } from "../../../users/dto/response/user.dto";


export class AuthResponseDto {
  @Expose()
  message: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  access_token:string
}