import {
  useMutation,
  useQuery,
  MutationOptions,
  QueryOptions,
  QueryResult,
} from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetCart } from '@typings/entities/cart';
import { CartProduct } from '@typings/entities/product';
import { Data, ErrorResponse } from '@modules/api-response';
import { Cart } from '@server/entities/cart';
import * as dataSources from '@modules/data-sources/carts';

const useGetMyCart = (
  options?: QueryOptions<AxiosResponse<GetCart>, AxiosError<ErrorResponse>>
): QueryResult<AxiosResponse<GetCart>, AxiosError<ErrorResponse>> => {
  return useQuery('/api/v1/carts/me', dataSources.getMyCart, options || {});
};

const useCreateCart = (
  options?: MutationOptions<
    AxiosResponse<Data<Partial<Cart>>>,
    {},
    AxiosError<ErrorResponse>
  >
) => {
  return useMutation(dataSources.createCart, options || undefined);
};

const useSyncCartItems = (
  options?: MutationOptions<
    AxiosResponse<CartProduct[]>,
    { userId: string; cartItems: CartProduct[] },
    AxiosError<ErrorResponse>
  >
) => {
  return useMutation(dataSources.syncCartItems, options || undefined);
};

export { useGetMyCart, useCreateCart, useSyncCartItems };
