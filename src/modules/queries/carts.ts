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
import { Data, Error } from '@modules/api-response';
import { Cart } from '@server/entities/cart';
import * as dataSources from '@modules/data-sources/carts';

const useGetMyCart = (
  options?: QueryOptions<AxiosResponse<GetCart>, AxiosError<Error[]>>
): QueryResult<AxiosResponse<GetCart>, AxiosError<Error[]>> => {
  return useQuery('/api/v1/carts/me', dataSources.getMyCart, options || {});
};

const useCreateCart = (
  options?: MutationOptions<
    AxiosResponse<Data<Partial<Cart>>>,
    {},
    AxiosError<Error[]>
  >
) => {
  return useMutation(dataSources.createCart, options || undefined);
};

const useSyncCartItems = (
  options?: MutationOptions<
    AxiosResponse<CartProduct[]>,
    { cartId: string; cartItems: CartProduct[] },
    AxiosError<Error[]>
  >
) => {
  return useMutation(dataSources.syncCartItems, options || undefined);
};

export { useGetMyCart, useCreateCart, useSyncCartItems };
