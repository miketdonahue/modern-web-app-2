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
    ['/api/v1/github/code', filename],
    () => dataSources.getGithubCode(filename),
    options || {}
  );
};

export const useGetGithubMarkdown = (
  filename: string,
  options?: QueryConfig<
    AxiosResponse<Data<{ contents: string }>>,
    AxiosError<ErrorResponse>
  >
): QueryResult<
  AxiosResponse<Data<{ contents: string }>>,
  AxiosError<ErrorResponse>
> => {
  return useQuery(
    ['/api/v1/github/file-contents', filename],
    () => dataSources.getGithubMarkdown(filename),
    options || {}
  );
};
