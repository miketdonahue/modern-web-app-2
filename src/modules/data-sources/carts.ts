import { AxiosResponse } from 'axios';
import { request } from '@modules/request';
import { Data } from '@modules/api-response';
import { Product, GetProduct } from '@typings/entities/product';
import { Cart } from '@typings/entities/cart';
import { CartItem } from '@typings/entities/cart-item';

export type CreateCartItems = {
  cartId: string;
  cartItems: GetProduct[];
};

const getMyCart = async (): Promise<
  AxiosResponse<
    Data<Partial<Cart>, { cart_items: CartItem[]; products: Product[] }>
  >
> => {
  const response = await request.get('/api/v1/carts/me');
  return response.data;
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

export { getMyCart, createCart, syncCartItems };
