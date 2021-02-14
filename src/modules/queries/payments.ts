import { useMutation, UseMutationOptions } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetProduct } from '@typings/api/product';
import { Data, ErrorResponse } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/payments';

export const useCreatePaymentSession = (
  options?: UseMutationOptions<
    AxiosResponse<Data<{ id: string }>>,
    AxiosError<ErrorResponse>,
    { orderItems: GetProduct[] }
  >
) => useMutation(dataSources.createPaymentSession, options || undefined);
