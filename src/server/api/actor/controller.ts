import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getManager } from '@server/modules/db-manager';
import { ApiResponseWithData } from '@modules/api-response';
import { CartItem } from '@server/entities/cart-item';

const stripe = new Stripe(process.env.STRIPE || '', {
  apiVersion: '2020-08-27',
});

/**
 * Get an actor's cart items
 */
const getActorCartItems = async (req: Request, res: Response) => {
  const db = getManager();
  const actorId = req.params.id;

  const actorCartItems: CartItem[] = await db.query(
    `
      SELECT cart_item.*
      FROM cart_item
      JOIN cart ON cart.id = cart_item.cart_id
      WHERE cart.actor_id = $1
        AND cart_item.deleted = false;
    `,
    [actorId]
  );

  const cartItemProductIds = actorCartItems.map((item) => item.product_id);

  if (!cartItemProductIds || !cartItemProductIds.length) {
    const response: ApiResponseWithData = {
      data: [],
    };

    return res.json(response);
  }

  const products = await stripe.products.list({
    ids: cartItemProductIds,
  });

  const transformedActorCartItems = products.data.map(
    async (product: Stripe.Product) => {
      const currentCartItem = actorCartItems.find(
        (item) => item.product_id === product.id
      );

      const price = await stripe.prices.list({
        product: currentCartItem?.product_id,
      });

      return {
        attributes: {
          ...product,
          quantity: currentCartItem?.quantity,
        },
        relationships: {
          price: { ...price.data[0] },
        },
      };
    }
  );

  const resolvedCartItems = await Promise.all(transformedActorCartItems);

  const response: ApiResponseWithData = {
    data: resolvedCartItems,
  };

  return res.json(response);
};

export { getActorCartItems };
