import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetPurchaseData } from '@typings/api/purchase';
import { ErrorResponse } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/purchases';

type PurchasesGetBy = { orderNumber?: string };

export const useGetPurchases = (
  getBy: PurchasesGetBy,
  options?: UseQueryOptions<
    AxiosResponse<GetPurchaseData[]>,
    AxiosError<ErrorResponse>
  >
): UseQueryResult<
  AxiosResponse<GetPurchaseData[]>,
  AxiosError<ErrorResponse>
> =>
  useQuery(
    '/api/v1/purchases',
    () => dataSources.getPurchases({ orderNumber: getBy.orderNumber }),
    options || {}
  );
