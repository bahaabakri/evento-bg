import { Expose, Type } from "class-transformer";
import { UserDto } from "./user.dto";


export class UserResponseDto {
  @Expose()
  message: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}