import { Request, Response } from 'express';
import { getManager } from '@server/modules/db-manager';
import { logger } from '@server/modules/logger';
import { Cart } from '@server/entities/cart';
import { CartItem } from '@server/entities/cart-item';
import { Product as ProductModel } from '@server/entities/product';
import {
  ApiResponseWithData,
  ApiResponseWithError,
  Data,
} from '@modules/api-response';
import { errorTypes } from '@server/modules/errors';

type Product = Data<ProductModel>;

/**
 * Get the user's own cart
 */
const getMine = async (req: Request, res: Response) => {
  return res.json({ id: '123' });
};

/**
 * Creates a new cart
 */
const createCart = async (req: Request, res: Response) => {
  const db = getManager();
  const actorId = (req as any).actor.actor_id;

  const existingCart = await db.findOne(Cart, { actor_id: actorId });

  if (existingCart) {
    logger.info(
      { cart: { uuid: existingCart.uuid } },
      'CART-CONTROLLER: Found existing cart'
    );

    const response: ApiResponseWithData<Partial<Cart>> = {
      data: {
        id: existingCart.uuid,
        attributes: { status: existingCart.status },
      },
    };

    return res.json(response);
  }

  const createdCart = db.create(Cart, {
    actor_id: actorId,
    status: 'new',
  });

  logger.info(
    { cart: { uuid: createdCart.uuid } },
    'CART-CONTROLLER: Creating new cart'
  );

  await db.save(createdCart);

  const response: ApiResponseWithData<Partial<Cart>> = {
    data: {
      id: createdCart.uuid,
      attributes: { status: createdCart.status },
    },
  };

  return res.json(response);
};

/**
 * Creates cart items in an existing cart
 */
const createCartItems = async (req: Request, res: Response) => {
  const db = getManager();
  const existingCart = await db.findOne(Cart, { uuid: req.params.cartId });
  const cartHasItems = req.body.cartItems && req.body.cartItems.length > 0;

  if (existingCart && cartHasItems) {
    const cartItemIds =
      req.body?.cartItems.map((item: Product) => item.id) || [];
    const productsInCart = await db.findByIds(ProductModel, cartItemIds);

    const items = productsInCart.map((product: ProductModel) => {
      return {
        cart_id: existingCart.uuid,
        product_id: product.uuid,
        quantity: 1,
      };
    });

    const createdCartItems = db.create(CartItem, items);

    logger.info(
      { cartId: existingCart.uuid },
      'CART-CONTROLLER: Creating cart items'
    );

    await db.save(createdCartItems);

    const responseItems = createdCartItems.map((item: CartItem) => {
      return {
        id: item.uuid,
        attributes: { quantity: item.quantity },
      };
    });

    const response: ApiResponseWithData<Partial<CartItem>> = {
      data: responseItems,
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
    { existingCart, cartHasItems },
    'CART-CONTROLLER: Invalid cart or cart items'
  );

  return res.status(401).json(errorResponse);
};

export { getMine, createCart, createCartItems };
