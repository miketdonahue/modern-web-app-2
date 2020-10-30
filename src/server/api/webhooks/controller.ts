import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getManager } from '@server/modules/db-manager';
import { logger } from '@server/modules/logger';
import { handleStripeError } from '@server/modules/errors/normalizers/stripe';
import { ApiResponseWithError, NormalizedError } from '@modules/api-response';
import { errorTypes } from '@server/modules/errors';
import { Customer } from '@server/entities/customer';
import { Purchase } from '@server/entities/purchase';
import { Product } from '@server/entities/product';
import { Cart } from '@server/entities/cart';
import { PurchaseItem } from '@server/entities/purchase-item';
import { CART_STATUS } from '@typings/entities/cart';

const stripe = new Stripe(process.env.STRIPE || '', {
  apiVersion: '2020-03-02',
});

/**
 * Payments webhook (Stripe)
 */
const stripePaymentsWebhook = async (req: Request, res: Response) => {
  const db = getManager();
  const payload = req.body;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const signature = req.headers['stripe-signature'] || '';
  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (error) {
    const err: NormalizedError = handleStripeError(error);

    logger.error({ err: error }, `WEBHOOK-CONTROLLER: ${error.message}`);
    return res.status(err.statusCode).json(err.response);
  }

  if (event.type === 'checkout.session.completed') {
    const response: { id?: string } = event.data.object;

    const session = await stripe.checkout.sessions.retrieve(response.id || '', {
      expand: ['customer', 'line_items'],
    });

    const customer: Partial<Customer> = {
      actor_id: session.metadata?.actor_id,
      vendor_id: (session.customer as Stripe.Customer)?.id,
    };

    /* Create customer if one does not already exist */
    try {
      await db
        .createQueryBuilder()
        .insert()
        .into(Customer)
        .values(customer)
        .onConflict(`("actor_id") DO NOTHING`)
        .execute();
    } catch (error) {
      const errorResponse: ApiResponseWithError = {
        error: [
          {
            status: '500',
            code: errorTypes.GENERIC.code,
            detail: errorTypes.GENERIC.detail,
            meta: {
              bypassFailureRedirect: true,
            },
          },
        ],
      };

      logger.error(
        { customer },
        'WEBHOOK-CONTROLLER: Could not create customer'
      );

      return res.status(500).json(errorResponse);
    }

    const createdCustomer = await db.findOne(Customer, {
      where: { actor_id: session.metadata?.actor_id },
    });

    /* Create a new purchase and purchase items */
    try {
      const newPurchase = db.create(Purchase, {
        customer_id: createdCustomer?.id,
        tax: session.total_details?.amount_tax,
        subtotal: Number(session.amount_subtotal),
        total: Number(session.amount_total),
      });

      const createdPurchase = await db.save(newPurchase);

      const purchaseItems =
        session.line_items?.data.map(async (item: Stripe.LineItem) => {
          const product = await db.findOne(Product, {
            vendor_id: item.price.product as string,
          });

          return {
            purchase_id: createdPurchase.id,
            product_id: product?.id,
            quantity: item.quantity || 1,
          };
        }) || [];

      const resolvedPurchaseItems = await Promise.all(purchaseItems);
      await db.insert(PurchaseItem, resolvedPurchaseItems);

      /* Update cart status */
      const [existingCart] = await db.query(
        `
          SELECT *
          FROM cart
          WHERE actor_id = $1
          ORDER BY created_at DESC
          LIMIT 1;
        `,
        [session.metadata?.actor_id]
      );

      await db.update(
        Cart,
        { id: existingCart?.id },
        { status: CART_STATUS.PAID }
      );
    } catch (error) {
      const errorResponse: ApiResponseWithError = {
        error: [
          {
            status: '500',
            code: errorTypes.GENERIC.code,
            detail: errorTypes.GENERIC.detail,
            meta: {
              bypassFailureRedirect: true,
            },
          },
        ],
      };

      logger.error(
        { customer },
        'WEBHOOK-CONTROLLER: Could not create purchase or purchase items'
      );

      return res.status(500).json(errorResponse);
    }
  }

  return res.status(200);
};

export { stripePaymentsWebhook };
