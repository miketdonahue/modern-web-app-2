import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getManager } from '@server/modules/db-manager';
import { logger } from '@server/modules/logger';
import { ApiResponseWithData } from '@modules/api-response';
import { ActorAccount } from '@server/entities/actor-account';
import { CartItem } from '@server/entities/cart-item';

const stripe = new Stripe(process.env.STRIPE || '', {
  apiVersion: '2020-08-27',
});

/**
 * Unlock account
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const unlockActorAccount = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
  const { db } = context;

  logger.info('AUTH-RESOLVER: Unlocking account');
  const updatedActorAccount = await db
    .createQueryBuilder()
    .update(ActorAccount)
    .set({
      locked: false,
      locked_code: null,
      locked_expires: null,
      login_attempts: 0,
    })
    .where('locked_code = :lockedCode', {
      lockedCode: args.input.code,
    })
    .returning('actor_id')
    .execute();

  const [actorAccount] = updatedActorAccount.raw;

  return { actorId: actorAccount.actor_id };
};

/**
 * Unlock account
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const resetPassword = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
  const { db } = context;

  logger.info('AUTH-RESOLVER: Unlocking account');
  const updatedActorAccount = await db
    .createQueryBuilder()
    .update(ActorAccount)
    .set({
      locked: false,
      locked_code: null,
      locked_expires: null,
      login_attempts: 0,
    })
    .where('locked_code = :lockedCode', {
      lockedCode: args.input.code,
    })
    .returning('actor_id')
    .execute();

  const [actorAccount] = updatedActorAccount.raw;

  return { actorId: actorAccount.actor_id };
};

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

export { unlockActorAccount, resetPassword, getActorCartItems };
