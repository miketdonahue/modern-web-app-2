import { useQuery, QueryOptions, QueryResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { CartProduct } from '@typings/entities/product';
import { Error } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/products';

export const useGetProducts = (
  options?: QueryOptions<AxiosResponse<CartProduct[]>, AxiosError<Error[]>>
): QueryResult<AxiosResponse<CartProduct[]>, AxiosError<Error[]>> => {
  return useQuery('/api/v1/products', dataSources.getProducts, options || {});
};
