import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getManager } from '@server/modules/db-manager';
import { logger } from '@server/modules/logger';
import { Customer } from '@server/entities/customer';
import { ApiResponseWithData, NormalizedError } from '@modules/api-response';
import { handleStripeError } from '@server/modules/errors/normalizers/stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET || '', {
  apiVersion: '2020-08-27',
});

/**
 * Creates a new customer
 */
const createCustomer = async (req: Request, res: Response) => {
  const db = getManager();
  const actorId = (req as any).actor.id;
  const values: Partial<Customer> & {
    name: string;
    email: string;
  } = req.body;

  const stripeCustomer = await stripe.customers.create();

  logger.info(
    { stripeCustomerId: stripeCustomer.id },
    'CUSTOMER-CONTROLLER: Creating a Stripe customer'
  );

  const newCustomer = db.create(Customer, {
    actor_id: actorId,
    vendor_id: stripeCustomer.id,
    address_line1: values.address_line1,
    address_line2: values.address_line2,
    city: values.city,
    state: values.state,
    postal_code: values.postal_code,
    country: values.country,
  });

  const savedCustomer = await db.save(newCustomer);

  logger.info(
    { customerId: newCustomer.id },
    'CUSTOMER-CONTROLLER: Saved customer'
  );

  try {
    await stripe.customers.update(savedCustomer.vendor_id || '', {
      email: values.email,
      name: values.name,
      address: {
        line1: savedCustomer.address_line1 || '',
        line2: savedCustomer.address_line2 || '',
        city: savedCustomer.city || '',
        state: savedCustomer.state || '',
        postal_code: savedCustomer.postal_code || '',
        country: savedCustomer.country || '',
      },
      metadata: {
        internal_id: savedCustomer.id,
      },
    });
  } catch (error) {
    const err: NormalizedError = handleStripeError(error);

    logger.error({ err: error }, `CUSTOMER-CONTROLLER: ${error.message}`);
    return res.status(err.statusCode).json(err.response);
  }

  const { id, ...restOfAttributes } = savedCustomer;
  const response: ApiResponseWithData<Partial<Customer>> = {
    data: {
      attributes: { id, ...restOfAttributes },
    },
  };

  return res.json(response);
};

export { createCustomer };
