import { request } from '@modules/request';

type CreateCartItems = {
  cartId: string;
  cartItems: any[];
};

const createCart = async (body: any = {}) => {
  const response = await request.post('/api/v1/carts', { ...body });
  return response.data;
};

const createCartItems = async ({ cartId, cartItems }: CreateCartItems) => {
  const response = await request.post(`/api/v1/carts/${cartId}/items`, {
    cartItems,
  });

  return response.data;
};

export { createCart, createCartItems };
