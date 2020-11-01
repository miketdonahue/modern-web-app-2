import { AxiosResponse } from 'axios';
import { Data } from '@modules/api-response';
import { request } from '@modules/request';
import { Customer } from '@typings/entities/customer';

export type CreateCustomer = Partial<Customer> & {
  name: string;
  email: string;
};

export const createCustomer = async (
  payload: CreateCustomer
): Promise<AxiosResponse<Data<Partial<Customer>>>> => {
  const response = await request.post('/api/v1/customers', {
    ...payload,
  });

  return response.data;
};
