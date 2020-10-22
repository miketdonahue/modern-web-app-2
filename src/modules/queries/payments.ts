import { useMutation, MutationOptions } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetProduct } from '@typings/entities/product';
import { Data, Error } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/payments';

export const useCreatePaymentSession = (
  options?: MutationOptions<
    AxiosResponse<Data<{ id: string }>>,
    { orderItems: GetProduct[] },
    AxiosError<Error[]>
  >
) => {
  return useMutation(dataSources.createPaymentSession, options || undefined);
};
