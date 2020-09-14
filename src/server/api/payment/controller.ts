import { Request, Response } from 'express';
import Stripe from 'stripe';
// import { logger } from '@server/modules/logger';
import { CartItem } from '@server/entities/cart-item';
import { calculateOrderTotal } from '@modules/transforms/currency';
import {
  ApiResponseWithData,
  Data,
  // ApiResponseWithError,
} from '@modules/api-response';
// import { errorTypes } from '@server/modules/errors';

const stripe = new Stripe(process.env.STRIPE || '', {
  apiVersion: '2020-03-02',
});

/**
 * Creates a new payment intent
 */
const createPaymentIntent = async (req: Request, res: Response) => {
  const items = req.body.orderItems.map((item: Data<Partial<CartItem>>) => {
    return {
      quantity: item.attributes?.quantity,
      price: item.relationships?.product?.attributes.price,
    };
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderTotal(items),
    currency: 'usd',
  });

  const response: ApiResponseWithData<{ clientSecret: string }> = {
    data: {
      id: paymentIntent.id,
      attributes: { clientSecret: paymentIntent.client_secret || '' },
    },
  };

  return res.json(response);
};

export { createPaymentIntent };
