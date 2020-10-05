import { useMutation, MutationOptions, MutationResultPair } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetProduct } from '@typings/stripe';
import { CreateCartItems } from '@modules/data-sources/carts';
import * as dataSources from '@modules/data-sources/carts';

const createCart = (
  options?: MutationOptions<AxiosResponse, any, AxiosError>
) => {
  return useMutation(dataSources.createCart, options || undefined);
};

const syncCartItems = (
  options?: MutationOptions<AxiosResponse<GetProduct[]>, any, AxiosError>
): MutationResultPair<
  AxiosResponse<GetProduct[]>,
  CreateCartItems,
  AxiosError
> => {
  return useMutation(dataSources.syncCartItems, options || undefined);
};

export { createCart, syncCartItems };
