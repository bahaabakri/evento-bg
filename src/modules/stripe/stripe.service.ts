import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  }

  async createPaymentIntent(amount: number, currency: string, metadata: Record<string, any>) {
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
      process.env.STRIPE_WEBHOOK_SECRET || '',
    );
  }
}
