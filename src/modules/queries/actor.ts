import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetProduct } from '@typings/api/product';
import { ErrorResponse } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/actor';

export const useGetActorCourses = (
  options?: UseQueryOptions<
    AxiosResponse<GetProduct[]>,
    AxiosError<ErrorResponse>
  >
): UseQueryResult<AxiosResponse<GetProduct[]>, AxiosError<ErrorResponse>> =>
  useQuery('/api/v1/actor/courses', dataSources.getActorCourses, options || {});
