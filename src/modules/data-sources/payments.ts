import { request } from '@modules/request';
import { CartItem } from '@server/entities/cart-item';

type CreatePaymentIntentPayload = {
  orderItems: Partial<CartItem>[];
};

export const createPaymentIntent = async (
  payload: CreatePaymentIntentPayload
) => {
  const response = await request.post('/api/v1/payments/intent', {
    ...payload,
  });

  return response.data;
};
