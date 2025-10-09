import { Expose } from 'class-transformer';

export class PaginationDto {
  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  perPage: number;
}
