import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getManager } from '@server/modules/db-manager';
import { logger } from '@server/modules/logger';
import { Customer } from '@server/entities/customer';
import { Product as ProductModel } from '@server/entities/product';
import {
  ApiResponseWithData,
  // ApiResponseWithError,
  Data,
} from '@modules/api-response';
// import { errorTypes } from '@server/modules/errors';

type Product = Data<ProductModel>;

const stripe = new Stripe(process.env.STRIPE || '', {
  apiVersion: '2020-03-02',
});

/**
 * Creates a new customer
 */
const createCustomer = async (req: Request, res: Response) => {
  const db = getManager();
  const actorId = (req as any).actor.id;
  const values: Partial<Customer> = req.body.values;

  const stripeCustomer = await stripe.customers.create();

  logger.info(
    { stripeCustomerId: stripeCustomer.id },
    'CUSTOMER-CONTROLLER: Creating a Stripe customer'
  );

  const newCustomer = db.create(Customer, {
    actor_id: actorId,
    vendor_id: stripeCustomer.id,
    address: values.address,
    address2: values.address2,
    city: values.city,
    state: values.state,
    zip_code: values.zip_code,
    country: values.country,
  });

  const savedCustomer = await db.save(newCustomer);

  logger.info(
    { customerId: newCustomer.id },
    'CUSTOMER-CONTROLLER: Saved customer'
  );

  await stripe.customers.update(savedCustomer.vendor_id || '', {
    address: {
      line1: savedCustomer.address || '',
      line2: savedCustomer.address2 || '',
      city: savedCustomer.city || '',
      state: savedCustomer.state || '',
      postal_code: savedCustomer.zip_code || '',
      country: savedCustomer.country || '',
    },
  });

  const { id, ...restOfAttributes } = savedCustomer;
  const response: ApiResponseWithData<Partial<Customer>> = {
    data: {
      id,
      attributes: { ...restOfAttributes },
    },
  };

  return res.json(response);
};

export { createCustomer };
