import { useQuery, QueryConfig, QueryResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { ErrorResponse, Data } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/github';

export const useGetGithubCode = (
  filename: string,
  options?: QueryConfig<
    AxiosResponse<Data<{ code: string }>>,
    AxiosError<ErrorResponse>
  >
): QueryResult<
  AxiosResponse<Data<{ code: string }>>,
  AxiosError<ErrorResponse>
> => {
  return useQuery(
    '/api/v1/github/code',
    () => dataSources.getGithubCode(filename),
    options || {}
  );
};
