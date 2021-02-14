import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { ErrorResponse, Data } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/github';

export const useGetGithubCode = (
  filename: string,
  options?: UseQueryOptions<
    AxiosResponse<Data<{ code: string }>>,
    AxiosError<ErrorResponse>
  >
): UseQueryResult<
  AxiosResponse<Data<{ code: string }>>,
  AxiosError<ErrorResponse>
> =>
  useQuery(
    ['/api/v1/github/code', filename],
    () => dataSources.getGithubCode(filename),
    options || {}
  );

export const useGetGithubMarkdown = (
  filename: string,
  options?: UseQueryOptions<
    AxiosResponse<Data<{ contents: string }>>,
    AxiosError<ErrorResponse>
  >
): UseQueryResult<
  AxiosResponse<Data<{ contents: string }>>,
  AxiosError<ErrorResponse>
> =>
  useQuery(
    ['/api/v1/github/file-contents', filename],
    () => dataSources.getGithubMarkdown(filename),
    options || {}
  );
