import { AxiosResponse } from 'axios';
import { request } from '@modules/request';
import { CartProduct } from '@typings/api/product';

const getActorBooks = async (): Promise<AxiosResponse<CartProduct[]>> => {
  const response = await request.get('/api/v1/actor/books');
  return response.data;
};

export { getActorBooks };
