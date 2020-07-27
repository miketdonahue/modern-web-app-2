import { useQuery, BaseQueryOptions } from 'react-query';
import { AxiosError } from 'axios';
import * as dataSources from '@modules/data-sources/products';

const getProducts = (options?: BaseQueryOptions<unknown, AxiosError>) => {
  return useQuery('/api/v1/products', dataSources.getProducts, options || {});
};

export { getProducts };
