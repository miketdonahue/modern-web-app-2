import { useMutation, MutationConfig } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { Data, ErrorResponse } from '@modules/api-response';
import { Customer } from '@typings/entities/customer';
import * as dataSources from '@modules/data-sources/customers';

export const useCreateCustomer = (
  options?: MutationConfig<
    AxiosResponse<Data<Partial<Customer>>>,
    AxiosError<ErrorResponse>,
    {}
  >
) => {
  return useMutation(dataSources.createCustomer, options || undefined);
};
