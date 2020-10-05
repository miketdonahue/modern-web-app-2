import { Request, Response } from 'express';
import Stripe from 'stripe';
import { ApiResponseWithData } from '@modules/api-response';

const stripe = new Stripe(process.env.STRIPE || '', {
  apiVersion: '2020-03-02',
});

/**
 * Get all prices expanded to include product
 */
const getPrices = async (req: Request, res: Response) => {
  const prices = await stripe.prices.list({
    active: true,
    expand: ['data.product'],
  });

  const response: ApiResponseWithData<Stripe.Price> = {
    data: prices.data,
  };

  return res.json(response);
};

export { getPrices };
