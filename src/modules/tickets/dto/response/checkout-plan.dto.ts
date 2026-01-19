import { Expose } from "class-transformer";

export class CheckoutPlanDto {
  @Expose()
  planId: number;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  quantity: number;
}
