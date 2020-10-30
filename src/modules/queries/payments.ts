import { useMutation, MutationConfig } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetProduct } from '@typings/entities/product';
import { Data, ErrorResponse } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/payments';

export const useCreatePaymentSession = (
  options?: MutationConfig<
    AxiosResponse<Data<{ id: string }>>,
    AxiosError<ErrorResponse>,
    { orderItems: GetProduct[] }
  >
) => {
  return useMutation(dataSources.createPaymentSession, options || undefined);
};
