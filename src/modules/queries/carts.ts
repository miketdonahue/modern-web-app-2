import { useMutation, MutationOptions } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import * as dataSources from '@modules/data-sources/carts';

const createCart = (
  options?: MutationOptions<AxiosResponse, any, AxiosError>
) => {
  return useMutation(dataSources.createCart, options || undefined);
};

const syncCartItems = (
  options?: MutationOptions<AxiosResponse, any, AxiosError>
) => {
  return useMutation(dataSources.syncCartItems, options || undefined);
};

export { createCart, syncCartItems };
