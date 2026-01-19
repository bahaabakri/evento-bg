import { Expose } from 'class-transformer';
export class CheckoutEventDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  date: string;

  @Expose()
  location: string;
}