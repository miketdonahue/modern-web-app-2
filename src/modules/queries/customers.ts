import { useMutation, MutationOptions } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import * as dataSources from '@modules/data-sources/customers';

export const useCreateCustomer = (
  options?: MutationOptions<
    AxiosResponse<dataSources.CreateCustomer>,
    any,
    AxiosError
  >
) => {
  return useMutation(dataSources.createCustomer, options || undefined);
};
