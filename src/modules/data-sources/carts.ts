import { request } from '@modules/request';

export type CreateCartItems = {
  cartId: string;
  cartItems: any[];
};

const createCart = async (body: any = {}) => {
  const response = await request.post('/api/v1/carts', { ...body });
  return response.data;
};

const syncCartItems = async ({ cartId, cartItems }: CreateCartItems) => {
  const response = await request.patch(`/api/v1/carts/${cartId}/sync`, {
    cartItems,
  });

  return response.data;
};

export { createCart, syncCartItems };
