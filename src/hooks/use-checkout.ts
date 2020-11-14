import { loadStripe } from '@stripe/stripe-js';

type Checkout = {
  sessionId: string;
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE || '');

export const useCheckout = async ({ sessionId }: Checkout) => {
  const stripe = await stripePromise;

  try {
    await stripe?.redirectToCheckout({
      sessionId,
    });
  } catch (error) {
    return {
      status: 500,
      code: 'CHECKOUT_ERROR',
      detail:
        'There was a problem completing the check out of your order. Please try again or contact us for help.',
    };
  }

  return undefined;
};
