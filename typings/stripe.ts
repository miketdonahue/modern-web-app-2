import Stripe from 'stripe';
import { Data } from '@modules/api-response';

export type StripeProduct = Stripe.Product & {
  price: Stripe.Price;
};

export type GetProduct = Data<
  Stripe.Product & { quantity: number },
  { price: Omit<Stripe.Price, 'product'> }
>;
