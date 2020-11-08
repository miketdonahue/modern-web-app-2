import { useQuery, QueryConfig, QueryResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetPurchaseData } from '@typings/api/purchase';
import { ErrorResponse } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/purchases';

type PurchasesGetBy = { orderNumber?: string };

export const useGetPurchases = (
  getBy: PurchasesGetBy,
  options?: QueryConfig<
    AxiosResponse<GetPurchaseData[]>,
    AxiosError<ErrorResponse>
  >
): QueryResult<AxiosResponse<GetPurchaseData[]>, AxiosError<ErrorResponse>> => {
  return useQuery(
    '/api/v1/purchases',
    () => dataSources.getPurchases({ orderNumber: getBy.orderNumber }),
    options || {}
  );
};
