import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getManager } from '@server/modules/db-manager';
import { logger } from '@server/modules/logger';
import { handleStripeError } from '@server/modules/errors/normalizers/stripe';
import { ApiResponseWithData, NormalizedError } from '@modules/api-response';
import { Actor } from '@server/entities/actor';
import { Cart } from '@server/entities/cart';
import { CartProduct } from '@typings/entities/product';
import { CART_STATUS } from '@typings/entities/cart';

const stripe = new Stripe(process.env.STRIPE || '', {
  apiVersion: '2020-08-27',
});

/**
 * Creates a new payment session (Stripe)
 */
const createPaymentSession = async (req: Request, res: Response) => {
  const db = getManager();
  const SUCCESS_DOMAIN = 'http://localhost:8080/app/cart/checkout';
  const CANCEL_DOMAIN = 'http://localhost:8080/app/products';

  const actorId = (req as any).actor.id;
  const orderItems: CartProduct[] = req.body.orderItems;

  const [existingCart] = await db.query(
    `
      SELECT *
      FROM cart
      WHERE actor_id = $1
      ORDER BY created_at DESC
      LIMIT 1;
    `,
    [actorId]
  );

  await db.update(
    Cart,
    { id: existingCart?.id },
    { status: CART_STATUS.CHECKOUT }
  );

  const actor = await db.findOne(Actor, { where: { id: actorId } });
  const preparedLineItems = orderItems.map(async (item) => {
    const price = await stripe.prices.list({
      product: item.attributes.vendor_id,
    });

    return {
      price: price.data[0].id,
      quantity: item.attributes.quantity,
    };
  });

  const lineItems = await Promise.all(preparedLineItems);

  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: actor?.email,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${SUCCESS_DOMAIN}`,
      cancel_url: `${CANCEL_DOMAIN}?canceled=true`,
      metadata: {
        actor_id: actorId,
      },
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
