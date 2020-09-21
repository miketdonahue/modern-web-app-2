import { request } from '@modules/request';
import { Customer } from '@server/entities/customer';

export type CreateCustomer = Partial<Customer> & {
  name: string;
  email: string;
};

export const createCustomer = async (payload: CreateCustomer) => {
  const response = await request.post('/api/v1/customers', {
    ...payload,
  });

  return response.data;
};
