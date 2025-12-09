import {
  Controller,
  Post,
  Req,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { TicketsService } from '../tickets/tickets.service';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly ticketsService: TicketsService,
  ) {}

  @Post('webhook')
  async handleWebhook(
    @Req() req,
    @Headers('stripe-signature') signature: string,
  ) {
    let event;

    try {
      event = this.stripeService.verifyWebhook(signature, req.rawBody);
    } catch (err) {
      throw new BadRequestException(`Webhook error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;

        const ticketIds = paymentIntent.metadata.tickets
          .split(',')
          .map((id) => Number(id));

        await this.ticketsService.markTicketsAsPaid(ticketIds);

        break;
    }

    return { received: true };
  }
}
