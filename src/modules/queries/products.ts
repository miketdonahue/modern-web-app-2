import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { CartProduct } from '@typings/api/product';
import { ErrorResponse } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/products';

export const useGetProducts = (
  options?: UseQueryOptions<
    AxiosResponse<CartProduct[]>,
    AxiosError<ErrorResponse>
  >
): UseQueryResult<AxiosResponse<CartProduct[]>, AxiosError<ErrorResponse>> =>
  useQuery('/api/v1/products', dataSources.getProducts, options || {});
