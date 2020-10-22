import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE || '', {
  apiVersion: '2020-03-02',
});

export const getStripeProducts = async () => {
  /*
    Stripe nests product inside prices, not prices inside product. Strange decision.
    I flipped this around here to work with products & price in a more logical manner.
  */
  const prices = await stripe.prices.list({
    active: true,
    expand: ['data.product'],
  });

  const productsWithPrices = prices.data.map((price) => {
    const { product, ...priceObject } = price;

    return {
      attributes: { ...(product as Stripe.Product) },
      relationships: {
        price: { ...priceObject },
      },
    };
  });

  return productsWithPrices;
};

export const transformStripeProduct = (price: Stripe.Price) => {
  const { product, ...priceObject } = price;

  return {
    attributes: { ...(product as Stripe.Product) },
    relationships: {
      price: { ...priceObject },
    },
  };
};
