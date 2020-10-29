import { useQuery, QueryOptions, QueryResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { Data, ErrorResponse } from '@modules/api-response';
import { request } from '@modules/request';

const isAuthenticated = (
  options?: QueryOptions<
    AxiosResponse<Data<{ id: string }>>,
    AxiosError<ErrorResponse>
  >
): QueryResult<
  AxiosResponse<Data<{ id: string }>>,
  AxiosError<ErrorResponse>
> => {
  const url = '/api/v1/auth/authenticated';

  return useQuery(
    url,
    async () => {
      const response = await request.get(url);
      return response.data;
    },
    options || {}
  );
};

export { isAuthenticated };
