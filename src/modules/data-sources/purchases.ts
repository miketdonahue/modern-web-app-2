import { AxiosResponse } from 'axios';
import { request } from '@modules/request';
import { GetPurchaseData } from '@typings/api/purchase';

type GetPurchasesPayload = {
  orderNumber?: string;
};

const getPurchases = async ({
  orderNumber,
}: GetPurchasesPayload): Promise<AxiosResponse<GetPurchaseData[]>> => {
  const response = await request.get('/api/v1/purchases', {
    params: {
      ...(orderNumber && { order_number: orderNumber }),
    },
  });
  return response.data;
};

export { getPurchases };
