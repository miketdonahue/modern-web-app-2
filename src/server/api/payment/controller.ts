import { Request, Response } from 'express';
import Stripe from 'stripe';
import { logger } from '@server/modules/logger';
import { handleStripeError } from '@server/modules/errors/normalizers/stripe';
import { ApiResponseWithData, NormalizedError } from '@modules/api-response';
import { GetProduct } from '@typings/stripe';

const stripe = new Stripe(process.env.STRIPE || '', {
  apiVersion: '2020-03-02',
});

/**
 * Creates a new payment session (Stripe)
 */
const createPaymentSession = async (req: Request, res: Response) => {
  const SUCCESS_DOMAIN = 'http://localhost:8080/app/cart/checkout';
  const CANCEL_DOMAIN = 'http://localhost:8080/app/cart';

  const orderItems: GetProduct[] = req.body.orderItems;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: orderItems.map((item) => ({
        price: item.relationships?.price.id,
        quantity: item.attributes.quantity,
      })),
      mode: 'payment',
      success_url: `${SUCCESS_DOMAIN}`,
      cancel_url: `${CANCEL_DOMAIN}?canceled=true`,
    });

    const response: ApiResponseWithData<{ id: string }> = {
      data: { attributes: { id: session.id } },
    };

    return res.json(response);
  } catch (error) {
    const err: NormalizedError = handleStripeError(error);

    logger.error({ err: error }, `PAYMENT-CONTROLLER: ${error.message}`);
    return res.status(err.statusCode).json(err.response);
  }
};

export { createPaymentSession };
