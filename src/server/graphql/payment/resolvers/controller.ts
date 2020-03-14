import Stripe from 'stripe';
import { ExternalError } from '@server/modules/errors';

const stripe = new Stripe(process.env.STRIPE as string, {
  apiVersion: '2020-03-02',
});

/**
 * Create a new payment charge
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const createCharge = async (): Promise<any> => {
  // TODO: based on UI, fill in the inputs
  try {
    await stripe.charges.create({
      amount: 2000,
      currency: 'usd',
      source: 'tok_visa', // does this source get set for the customer?
      description: 'Test Charge 1', // shows in email, product description
      statement_descriptor: '',
      customer: '',
      metadata: {},
    });
  } catch (error) {
    throw new ExternalError(error, { source: 'Stripe' });
  }
};

export default {
  Mutation: {
    createCharge,
  },
};
