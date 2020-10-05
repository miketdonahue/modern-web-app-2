import { request } from '@modules/request';

const getProducts = async () => {
  const response = await request.get('/api/v1/products');
  return response.data;
};

export { getProducts };
