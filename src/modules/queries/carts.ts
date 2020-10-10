import { useMutation, MutationOptions } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetProduct } from '@typings/stripe';
import { Data, Error } from '@modules/api-response';
import { Cart } from '@server/entities/cart';
import * as dataSources from '@modules/data-sources/carts';

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
    AxiosResponse<GetProduct[]>,
    { cartId: string; cartItems: GetProduct[] },
    AxiosError<Error[]>
  >
) => {
  return useMutation(dataSources.syncCartItems, options || undefined);
};

export { useCreateCart, useSyncCartItems };
