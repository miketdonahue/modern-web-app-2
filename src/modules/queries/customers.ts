import { useMutation, MutateConfig } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import * as dataSources from '@modules/data-sources/customers';

export const useCreateCustomer = (
  options?: MutateConfig<
    AxiosResponse<dataSources.CreateCustomer>,
    AxiosError,
    any
  >
) => {
  return useMutation(dataSources.createCustomer, options || undefined);
};
