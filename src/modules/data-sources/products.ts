import { AxiosResponse } from 'axios';
import { request } from '@modules/request';
import { CartProduct } from '@typings/entities/product';

const getProducts = async (): Promise<AxiosResponse<CartProduct[]>> => {
  const response = await request.get('/api/v1/products');
  return response.data;
};

const downloadProduct = async ({
  id,
}: {
  id: string;
}): Promise<AxiosResponse> => {
  const response = await request.get(`/api/v1/products/${id}/download`);
  return response.data;
};

export { getProducts, downloadProduct };
