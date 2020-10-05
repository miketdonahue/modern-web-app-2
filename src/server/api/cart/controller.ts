import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getManager } from '@server/modules/db-manager';
import { logger } from '@server/modules/logger';
import { Cart } from '@server/entities/cart';
import { CartItem } from '@server/entities/cart-item';
import { GetProduct } from '@typings/stripe';
import {
  ApiResponseWithData,
  ApiResponseWithError,
} from '@modules/api-response';
import { errorTypes } from '@server/modules/errors';

/**
 * Creates a new cart
 */
const createCart = async (req: Request, res: Response) => {
  const db = getManager();
  const actorId = (req as any).actor.id;

  const existingCart = await db.findOne(Cart, { actor_id: actorId });

  if (existingCart) {
    logger.info(
      { cart: { id: existingCart.id } },
      'CART-CONTROLLER: Found existing cart'
    );

    const response: ApiResponseWithData<Partial<Cart>> = {
      data: {
        attributes: { id: existingCart.id, status: existingCart.status },
      },
    };

    return res.json(response);
  }

  const createdCart = db.create(Cart, {
    actor_id: actorId,
    status: 'new',
  });

  logger.info(
    { cart: { id: createdCart.id } },
    'CART-CONTROLLER: Creating new cart'
  );

  await db.save(createdCart);

  const response: ApiResponseWithData<Partial<Cart>> = {
    data: {
      attributes: { id: createdCart.id, status: createdCart.status },
    },
  };

  return res.json(response);
};

/**
 * Sync cart items with external cart source (i.e. localStorage)
 */
const syncCartItems = async (req: Request, res: Response) => {
  const db = getManager();
  const cartItems: GetProduct[] = req.body.cartItems;

  const existingCart = await db.findOne(Cart, { id: req.params.cartId });
  const externalCartHasItems = cartItems && cartItems.length > 0;

  if (existingCart && externalCartHasItems) {
    const items = req.body?.cartItems.map((product: GetProduct) => {
      return {
        cart_id: existingCart.id,
        product_id: product.attributes.id,
        quantity: 1,
      };
    });

    const createdCartItems = db.create(CartItem, items);

    /* Mark all existing cart items as deleted */
    await db.query(
      `
      UPDATE cart_item
      SET deleted = true
      WHERE cart_id = $1;
    `,
      [existingCart.id]
    );

    /* Upsert all items from external cart */
    await db
      .createQueryBuilder()
      .insert()
      .into(CartItem)
      .values(createdCartItems)
      .onConflict(
        `
        ("cart_id", "product_id")
          DO UPDATE SET
            "quantity" = excluded.quantity,
            "deleted" = false
        `
      )
      .execute();

    // const responseItems = createdCartItems.map((item: CartItem) => {
    //   const cartProduct = productsInCart.find((i) => i.id === item.product_id);

    //   return {
    //     id: item.id,
    //     attributes: { quantity: item.quantity },
    //     relationships: {
    //       product: {
    //         id: cartProduct?.id || '',
    //         attributes: {
    //           name: cartProduct?.name || '',
    //           short_description: cartProduct?.short_description || '',
    //           description: cartProduct?.description || '',
    //           thumbnail: cartProduct?.thumbnail || '',
    //           image: cartProduct?.image || '',
    //           price: cartProduct?.price || null,
    //           discount: cartProduct?.discount || 0,
    //         },
    //       },
    //     },
    //   };
    // });

    const response: ApiResponseWithData<
      Stripe.Product,
      { price: Omit<Stripe.Price, 'product'> }
    > = {
      data: cartItems,
    };

    return res.json(response);
  }

  const errorResponse: ApiResponseWithError = {
    error: [
      {
        status: '401',
        code: errorTypes.INVALID_CART_ITEMS.code,
        detail: errorTypes.INVALID_CART_ITEMS.detail,
        meta: {
          bypassFailureRedirect: true,
        },
      },
    ],
  };

  logger.error(
    { existingCart, externalCartHasItems },
    'CART-CONTROLLER: Invalid cart or cart items'
  );

  return res.status(401).json(errorResponse);
};

export { createCart, syncCartItems };
