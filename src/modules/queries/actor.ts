import { useQuery, QueryConfig, QueryResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetProduct } from '@typings/api/product';
import { ErrorResponse } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/actor';

export const useGetActorBooks = (
  options?: QueryConfig<AxiosResponse<GetProduct[]>, AxiosError<ErrorResponse>>
): QueryResult<AxiosResponse<GetProduct[]>, AxiosError<ErrorResponse>> => {
  return useQuery(
    '/api/v1/actor/courses',
    dataSources.getActorCourses,
    options || {}
  );
};
