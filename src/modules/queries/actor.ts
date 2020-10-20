import { useQuery, QueryOptions, QueryResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetProduct } from '@typings/stripe';
import { Error } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/actor';

export const useGetActorCart = (
  actorId: string,
  options?: QueryOptions<AxiosResponse<GetProduct[]>, AxiosError<Error[]>>
): QueryResult<AxiosResponse<GetProduct[]>, AxiosError<Error[]>> => {
  return useQuery(
    `/api/v1/actor/${actorId}/cart-items`,
    () => dataSources.getActorCartItems(actorId),
    options || {}
  );
};
