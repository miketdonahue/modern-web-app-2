import Stripe from 'stripe';
import { Data } from '@modules/api-response';
import { Product } from '@server/entities/product';

export type StripeProduct = Stripe.Product & {
  price: Stripe.Price;
};

export type GetProduct = Data<Product[]>;
