import { useQuery, QueryOptions, QueryResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetProduct } from '@typings/stripe';
import {} from '@modules/api-response';
import * as dataSources from '@modules/data-sources/products';

const getProducts = (
  options?: QueryOptions<AxiosResponse<GetProduct[]>, AxiosError>
): QueryResult<AxiosResponse<GetProduct[]>, AxiosError> => {
  return useQuery('/api/v1/products', dataSources.getProducts, options || {});
};

export { getProducts };
