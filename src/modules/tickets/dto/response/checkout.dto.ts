import { Expose } from "class-transformer";
import { CheckoutTicketDto } from "./checkout-ticket.dto";
import { CheckoutPlanDto } from "./checkout-plan.dto";
import { CheckoutEventDto } from "./checkout-event.dto";

export class CheckoutDto {
  @Expose()
  event: CheckoutEventDto;

  @Expose()
  plans: CheckoutPlanDto[];

  @Expose()
  total: number;

  @Expose()
  tickets: CheckoutTicketDto[];
}