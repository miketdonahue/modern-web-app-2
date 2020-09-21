import { Request, Response } from 'express';
import Stripe from 'stripe';
import { logger } from '@server/modules/logger';
import { CartItem } from '@server/entities/cart-item';
import { Product } from '@server/entities/product';
import { calculateOrderTotal } from '@modules/transforms/currency';
import { handleStripeError } from '@server/modules/errors/normalizers/stripe';
import {
  ApiResponseWithData,
  Data,
  NormalizedError,
} from '@modules/api-response';

const stripe = new Stripe(process.env.STRIPE || '', {
  apiVersion: '2020-03-02',
});

type PaymentIntentItemRelationships = {
  product: { id: 'product'; attributes: Partial<Product> };
};

type PaymentIntentItem = Data<
  Partial<CartItem>,
  PaymentIntentItemRelationships
>;

/**
 * Creates a new payment intent
 */
const createPaymentIntent = async (req: Request, res: Response) => {
  const items = req.body.orderItems.map((item: PaymentIntentItem) => {
    return {
      quantity: item.attributes?.quantity,
      price: item.relationships?.product?.attributes?.price,
    };
  });

  try {
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
  } catch (error) {
    const err: NormalizedError = handleStripeError(error);

    logger.error({ err: error }, `PAYMENT-CONTROLLER: ${error.message}`);
    return res.status(err.statusCode).json(err.response);
  }
};

export { createPaymentIntent };
