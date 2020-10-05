import Stripe from 'stripe';
import { request } from '@modules/request';

export type GetPrice = Stripe.Price & {
  product: Stripe.Product;
};

const getPrices = async () => {
  const response = await request.get('/api/v1/prices');
  return response.data;
};

export { getPrices };
