import { AxiosResponse } from 'axios';
import { request } from '@modules/request';
import { Data } from '@modules/api-response';
import { Product, CartProduct } from '@typings/entities/product';
import { Cart } from '@typings/entities/cart';
import { CartItem } from '@typings/entities/cart-item';

export type SyncCartItems = {
  userId: string;
  cartItems: CartProduct[];
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

const syncCartItems = async ({ userId, cartItems }: SyncCartItems) => {
  const response = await request.post(`/api/v1/carts/sync`, {
    userId,
    cartItems,
  });

  return response.data;
};

export { getMyCart, createCart, syncCartItems };
