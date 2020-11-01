import { AxiosResponse } from 'axios';
import { Data } from '@modules/api-response';
import { request } from '@modules/request';
import { GetProduct } from '@typings/entities/product';

type CreatePaymentSessionPayload = {
  orderItems: GetProduct[];
};

export const createPaymentSession = async (
  payload: CreatePaymentSessionPayload
): Promise<AxiosResponse<Data<{ id: string }>>> => {
  const response = await request.post('/api/v1/payments/session', {
    ...payload,
  });

  return response.data;
};
