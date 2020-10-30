import { Request, Response } from 'express';
import { In } from 'typeorm';
import { getManager } from '@server/modules/db-manager';
import { logger } from '@server/modules/logger';
import { Cart } from '@server/entities/cart';
import { CartItem } from '@server/entities/cart-item';
import { Product } from '@server/entities/product';
import { Product as ProductType, CartProduct } from '@typings/entities/product';
import { CART_STATUS } from '@typings/entities/cart';
import {
  ApiResponseWithData,
  ApiResponseWithError,
} from '@modules/api-response';
import { errorTypes } from '@server/modules/errors';

/**
 * Get the cart of the currently logged in user
 */
const getMyCart = async (req: Request, res: Response) => {
  const db = getManager();
  const actorId = (req as any).actor?.id;
  let myCart;

  // const existingCart = await db.findOne(Cart, { actor_id: actorId });
  const [existingCart] = await db.query(
    `
      SELECT *
      FROM cart
      WHERE actor_id = $1
      ORDER BY created_at DESC
      LIMIT 1;
    `,
    [actorId]
  );

  if (
    existingCart &&
    [CART_STATUS.ABANDONED, CART_STATUS.PAID].includes(existingCart.status)
  ) {
    const newCart = await db.create(Cart, {
      actor_id: actorId,
      status: CART_STATUS.NEW,
    });

    myCart = await db.save(newCart);
  } else {
    myCart = existingCart;
  }

  logger.info({ cartId: myCart?.id }, 'CART-CONTROLLER: Found my cart');

  const cartItems = await db.find(CartItem, {
    cart_id: myCart?.id,
    deleted: false,
  });

  const cartItemProductIds = cartItems.map((item) => item.product_id);
  const products = cartItemProductIds.length
    ? await db.find(Product, { id: In(cartItemProductIds) })
    : [];

  const response: ApiResponseWithData<
    Partial<Cart>,
    { cart_items: CartItem[]; products: ProductType[] }
  > = {
    data: {
      attributes: { id: myCart?.id, status: myCart?.status },
      relationships: {
        cart_items: cartItems,
        products,
      },
    },
  };

  return res.json(response);
};

/**
 * Creates a new cart
 */
const createCart = async (req: Request, res: Response) => {
  const db = getManager();
  const actorId = (req as any).actor?.id;

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
    status: CART_STATUS.NEW,
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
 * Partial update of an existing cart
 */
const changeCartStatus = async (req: Request, res: Response) => {
  const db = getManager();
  const actorId = (req as any).actor?.id;
  const status = req.body.status;

  const [existingCart] = await db.query(
    `
      SELECT *
      FROM cart
      WHERE actor_id = $1
      ORDER BY created_at DESC
      LIMIT 1;
    `,
    [actorId]
  );

  if (existingCart) {
    await db.update(Cart, { id: existingCart?.id }, { status });
  }

  return res.end();
};

/**
 * Add a new item to the cart
 */
const addCartItem = async (req: Request, res: Response) => {
  const db = getManager();
  const { cartId } = req.params;
  const cartItem: CartItem = req.body;
  let newCartItem;

  const existingCartItem = await db.findOne(CartItem, {
    cart_id: cartId,
    product_id: cartItem.product_id,
  });

  if (existingCartItem) {
    newCartItem = db.merge(CartItem, existingCartItem, {
      quantity: existingCartItem.quantity + 1,
      deleted: false,
    });
  } else {
    newCartItem = db.create(CartItem, { ...cartItem, quantity: 1 });
  }

  await db.save(newCartItem);

  const cartItems = await db.find(CartItem, {
    cart_id: cartId,
    deleted: false,
  });

  await db.update(Cart, { id: cartId }, { status: CART_STATUS.ACTIVE });

  const cartItemProductIds = cartItems.map((item) => item.product_id);
  const products = await db.find(Product, { id: In(cartItemProductIds) });

  const response: ApiResponseWithData<
    Partial<CartItem>,
    { product: ProductType }
  > = {
    data: cartItems.map((item) => {
      return {
        attributes: { ...item },
        relationships: {
          product: {
            ...(products.find((p) => p.id === item.product_id) as ProductType),
          },
        },
      };
    }),
  };

  return res.json(response);
};

/**
 * Increment the quantity of an existing cart item
 */
const incrementCartItem = async (req: Request, res: Response) => {
  const db = getManager();
  const { cartId } = req.params;
  const cartItem: CartItem = req.body;
  let newCartItem;

  const existingCartItem = await db.findOne(CartItem, {
    cart_id: cartId,
    product_id: cartItem.product_id,
  });

  if (existingCartItem) {
    newCartItem = db.merge(CartItem, existingCartItem, {
      quantity: existingCartItem.quantity + 1,
    });
  }

  await db.save(newCartItem);

  const cartItems = await db.find(CartItem, {
    cart_id: cartId,
    deleted: false,
  });

  const cartItemProductIds = cartItems.map((item) => item.product_id);
  const products = await db.find(Product, { id: In(cartItemProductIds) });

  const response: ApiResponseWithData<
    Partial<CartItem>,
    { product: ProductType }
  > = {
    data: cartItems.map((item) => {
      return {
        attributes: { ...item },
        relationships: {
          product: {
            ...(products.find((p) => p.id === item.product_id) as ProductType),
          },
        },
      };
    }),
  };

  return res.json(response);
};

/**
 * Decrement the quantity of an existing cart item
 */
const decrementCartItem = async (req: Request, res: Response) => {
  const db = getManager();
  const { cartId } = req.params;
  const cartItem: CartItem = req.body;
  let newCartItem;

  const existingCartItem = await db.findOne(CartItem, {
    cart_id: cartId,
    product_id: cartItem.product_id,
  });

  if (existingCartItem) {
    newCartItem = db.merge(CartItem, existingCartItem, {
      quantity: existingCartItem.quantity - 1,
    });
  }

  await db.save(newCartItem);

  const cartItems = await db.find(CartItem, {
    cart_id: cartId,
    deleted: false,
  });

  const cartItemProductIds = cartItems.map((item) => item.product_id);
  const products = await db.find(Product, { id: In(cartItemProductIds) });

  const response: ApiResponseWithData<
    Partial<CartItem>,
    { product: ProductType }
  > = {
    data: cartItems.map((item) => {
      return {
        attributes: { ...item },
        relationships: {
          product: {
            ...(products.find((p) => p.id === item.product_id) as ProductType),
          },
        },
      };
    }),
  };

  return res.json(response);
};

/**
 * Remove an existing cart item
 */
const removeCartItem = async (req: Request, res: Response) => {
  const db = getManager();
  const { cartId } = req.params;
  const cartItem: CartItem = req.body;
  let newCartItem;

  const existingCartItem = await db.findOne(CartItem, {
    cart_id: cartId,
    product_id: cartItem.product_id,
  });

  if (existingCartItem) {
    newCartItem = db.merge(CartItem, existingCartItem, {
      quantity: 0,
      deleted: true,
    });
  }

  await db.save(newCartItem);

  const cartItems = await db.find(CartItem, {
    cart_id: cartId,
    deleted: false,
  });

  const cartItemProductIds = cartItems.map((item) => item.product_id);
  const products = cartItemProductIds.length
    ? await db.find(Product, { id: In(cartItemProductIds) })
    : [];

  const response: ApiResponseWithData<
    Partial<CartItem>,
    { product: ProductType }
  > = {
    data: cartItems.map((item) => {
      return {
        attributes: { ...item },
        relationships: {
          product: {
            ...(products.find((p) => p.id === item.product_id) as ProductType),
          },
        },
      };
    }),
  };

  return res.json(response);
};

/**
 * Delete an existing cart
 */
const deleteCart = async (req: Request, res: Response) => {
  const db = getManager();
  const { cartId } = req.params;

  const existingCart = await db.findOne(Cart, {
    id: cartId,
  });

  const updatedCart = db.merge(Cart, existingCart, { deleted: true });
  const savedCart = await db.save(updatedCart);

  const response: ApiResponseWithData<Partial<Cart>> = {
    data: { attributes: { ...savedCart } },
  };

  return res.json(response);
};

/**
 * Sync cart items to DB from external cart source (i.e. localStorage)
 */
const syncCartItems = async (req: Request, res: Response) => {
  const db = getManager();
  const userId = req.body.userId;
  const cartItems: CartProduct[] = req.body.cartItems;

  const existingCart = await db.findOne(Cart, { actor_id: userId });

  if (existingCart) {
    const items = cartItems?.map((product) => {
      return {
        cart_id: existingCart.id,
        product_id: product.attributes.id,
        quantity: product.attributes.quantity,
      };
    });

    const createdCartItems = db.create(CartItem, items);

    /* Mark all existing cart items as deleted */
    await db.query(
      `
        UPDATE cart_item
        SET
          deleted = true,
          updated_at = NOW()
        WHERE cart_id = $1;
      `,
      [existingCart.id]
    );

    /* Insert all items from external cart */
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
            "updated_at" = NOW(),
            "deleted" = false
        `
      )
      .execute();

    return res.end();
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

  logger.error({ existingCart }, 'CART-CONTROLLER: Invalid cart or cart items');
  return res.status(401).json(errorResponse);
};

export {
  getMyCart,
  createCart,
  changeCartStatus,
  addCartItem,
  incrementCartItem,
  decrementCartItem,
  removeCartItem,
  deleteCart,
  syncCartItems,
};
