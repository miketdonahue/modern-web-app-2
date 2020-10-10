import { useMutation, MutationOptions } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import * as dataSources from '@modules/data-sources/payments';

export const createPaymentSession = (
  options?: MutationOptions<AxiosResponse, any, AxiosError>
) => {
  return useMutation(dataSources.createPaymentSession, options || undefined);
};
