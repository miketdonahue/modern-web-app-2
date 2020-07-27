import { useQuery, BaseQueryOptions } from 'react-query';
import { AxiosError } from 'axios';
import { request } from '@modules/request';

const isAuthenticated = (options?: BaseQueryOptions<unknown, AxiosError>) => {
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
