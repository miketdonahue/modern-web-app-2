import { request } from '@modules/request';
import { GetProduct } from '@typings/stripe';

type CreatePaymentSessionPayload = {
  orderItems: GetProduct[];
};

export const createPaymentSession = async (
  payload: CreatePaymentSessionPayload
) => {
  const response = await request.post('/api/v1/payments/session', {
    ...payload,
  });

  return response.data;
};
