import { Expose } from "class-transformer";
import { TicketStatus } from "../../enums/ticket-status.enum";

export class CheckoutTicketDto {
  @Expose()
  id: number;

  @Expose()
  status: TicketStatus;

  @Expose()
  purchasedAt: Date | null;

  @Expose()
  reservationExpiresAt: Date | null;
}