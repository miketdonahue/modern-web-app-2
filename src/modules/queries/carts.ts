import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetCart } from '@typings/api/cart';
import { CartProduct } from '@typings/api/product';
import { ErrorResponse } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/carts';

const useGetMyCart = (
  options?: UseQueryOptions<AxiosResponse<GetCart>, AxiosError<ErrorResponse>>
): UseQueryResult<AxiosResponse<GetCart>, AxiosError<ErrorResponse>> =>
  useQuery('/api/v1/carts/me', dataSources.getMyCart, options || {});

const useSyncCartItems = (
  options?: UseMutationOptions<
    AxiosResponse<CartProduct[]>,
    AxiosError<ErrorResponse>,
    { userId: string; cartItems: CartProduct[] }
  >
) => useMutation(dataSources.syncCartItems, options || undefined);

export { useGetMyCart, useSyncCartItems };
