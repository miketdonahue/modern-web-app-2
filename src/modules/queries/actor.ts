import { useQuery, QueryConfig, QueryResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { CartProduct } from '@typings/api/product';
import { ErrorResponse } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/actor';

export const useGetActorBooks = (
  options?: QueryConfig<AxiosResponse<CartProduct[]>, AxiosError<ErrorResponse>>
): QueryResult<AxiosResponse<CartProduct[]>, AxiosError<ErrorResponse>> => {
  return useQuery(
    '/api/v1/actor/books',
    dataSources.getActorBooks,
    options || {}
  );
};
