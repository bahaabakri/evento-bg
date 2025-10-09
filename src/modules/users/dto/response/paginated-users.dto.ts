import { Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';
import { PaginationDto } from 'src/shared-dto/pagination.dto';

export class PaginatedUsersDto {
  @Expose()
  @Type(() => UserDto)
  data: UserDto[];

  @Expose()
  @Type(() => PaginationDto)
  meta: PaginationDto;
}
