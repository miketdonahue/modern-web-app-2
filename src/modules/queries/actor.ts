import { useQuery, QueryOptions, QueryResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetProduct } from '@typings/entities/product';
import { ErrorResponse } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/actor';

export const useGetActorCart = (
  actorId: string,
  options?: QueryOptions<AxiosResponse<GetProduct[]>, AxiosError<ErrorResponse>>
): QueryResult<AxiosResponse<GetProduct[]>, AxiosError<ErrorResponse>> => {
  return useQuery(
    `/api/v1/actor/${actorId}/cart-items`,
    () => dataSources.getActorCartItems(actorId),
    options || {}
  );
};
