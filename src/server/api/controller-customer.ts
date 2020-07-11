import Stripe from 'stripe';
import { logger } from '@server/modules/logger';
import { Actor } from '@server/entities/actor';
import { Customer } from '@server/entities/customer';

const stripe = new Stripe(process.env.STRIPE as string, {
  apiVersion: '2020-03-02',
});

/**
 * Create a new customer
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const createCustomer = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
  const { db } = context;
  const actor = await db.findOne(Actor, { id: args.input.actorId });

  if (!actor) {
    // Error
  }

  try {
    logger.info('PAYMENT-RESOLVER: Creating new customer');
    const customer = await stripe.customers.create({
      name: `${actor.firstName} ${actor.lastName}`,
      email: actor.email,
      phone: `+${actor.phoneCountryCode}${actor.phone}`,
      address: {
        line1: actor.address1,
        line2: actor.address2,
        city: actor.city,
        state: actor.state,
        postal_code: actor.postalCode,
        country: actor.country,
      },
      metadata: { id: actor.id },
    });

    return { ...customer };
  } catch (error) {
    // Error
    return undefined;
  }
};

/**
 * Update an existing customer
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const updateCustomer = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
  const { db } = context;
  const customer = db.findOne(Customer, { actor_id: args.input.actorId });

  if (!customer) {
    // Error
  }

  try {
    logger.info('CUSTOMER-RESOLVER: Updating customer');
    const updatedCustomer = await stripe.customers.update(customer.stripeId, {
      source: args.input.source,
    });

    return { ...updatedCustomer };
  } catch (error) {
    // Error
    return undefined;
  }
};

export default {
  Mutation: {
    createCustomer,
    updateCustomer,
  },
};
