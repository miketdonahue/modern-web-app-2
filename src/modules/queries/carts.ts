import {
  useMutation,
  useQuery,
  MutationConfig,
  QueryConfig,
  QueryResult,
} from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetCart } from '@typings/entities/cart';
import { CartProduct } from '@typings/entities/product';
import { Data, ErrorResponse } from '@modules/api-response';
import { Cart } from '@server/entities/cart';
import * as dataSources from '@modules/data-sources/carts';

const useGetMyCart = (
  options?: QueryConfig<AxiosResponse<GetCart>, AxiosError<ErrorResponse>>
): QueryResult<AxiosResponse<GetCart>, AxiosError<ErrorResponse>> => {
  return useQuery('/api/v1/carts/me', dataSources.getMyCart, options || {});
};

const useCreateCart = (
  options?: MutationConfig<
    AxiosResponse<Data<Partial<Cart>>>,
    {},
    AxiosError<ErrorResponse>
  >
) => {
  return useMutation(dataSources.createCart, options || undefined);
};

const useSyncCartItems = (
  options?: MutationConfig<
    AxiosResponse<CartProduct[]>,
    AxiosError<ErrorResponse>,
    { userId: string; cartItems: CartProduct[] }
  >
) => {
  return useMutation(dataSources.syncCartItems, options || undefined);
};

export { useGetMyCart, useCreateCart, useSyncCartItems };
