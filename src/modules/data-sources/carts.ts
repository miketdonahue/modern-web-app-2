import { AxiosResponse } from 'axios';
import { request } from '@modules/request';
import { Data } from '@modules/api-response';
import { GetCart, Cart } from '@typings/entities/cart';
import { CartProduct } from '@typings/entities/product';

export type SyncCartItems = {
  userId: string;
  cartItems: CartProduct[];
};

export type ChangeCartStatus = {
  status: string;
};

const getMyCart = async (): Promise<AxiosResponse<GetCart>> => {
  const response = await request.get('/api/v1/carts/me');
  return response.data;
};

const createCart = async (
  body: any = {}
): Promise<AxiosResponse<Data<Partial<Cart>>>> => {
  const response = await request.post('/api/v1/carts', { ...body });
  return response.data;
};

const changeCartStatus = async ({ status }: ChangeCartStatus) => {
  const response = await request.patch('/api/v1/carts/status', { status });
  return response.data;
};

const syncCartItems = async ({ userId, cartItems }: SyncCartItems) => {
  const response = await request.post(`/api/v1/carts/sync`, {
    userId,
    cartItems,
  });

  return response.data;
};

export { getMyCart, createCart, changeCartStatus, syncCartItems };
