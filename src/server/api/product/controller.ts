import { Request, Response } from 'express';
import Stripe from 'stripe';
import { ApiResponseWithData } from '@modules/api-response';

const stripe = new Stripe(process.env.STRIPE || '', {
  apiVersion: '2020-03-02',
});

/**
 * Get all products
 */
const getProducts = async (req: Request, res: Response) => {
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

  const response: ApiResponseWithData<
    Stripe.Product,
    { price: Omit<Stripe.Price, 'product'> }
  > = {
    data: productsWithPrices,
  };

  return res.json(response);
};

export { getProducts };
