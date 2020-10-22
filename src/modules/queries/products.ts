import { useQuery, QueryOptions, QueryResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetProduct } from '@typings/entities/product';
import { Error } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/products';

export const useGetProducts = (
  options?: QueryOptions<AxiosResponse<GetProduct[]>, AxiosError<Error[]>>
): QueryResult<AxiosResponse<GetProduct[]>, AxiosError<Error[]>> => {
  return useQuery('/api/v1/products', dataSources.getProducts, options || {});
};
