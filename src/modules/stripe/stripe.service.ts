import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') || '');
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: Record<string, any>,
  ) {
    return this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
    });
  }

  verifyWebhook(signature: string, payload: Buffer) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || ''
    );
  }
}
