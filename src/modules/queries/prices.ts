import { useQuery, QueryOptions, QueryResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import * as dataSources from '@modules/data-sources/prices';

const getPrices = (
  options?: QueryOptions<AxiosResponse<dataSources.GetPrice[]>, AxiosError>
): QueryResult<AxiosResponse<dataSources.GetPrice[]>, AxiosError> => {
  return useQuery('/api/v1/products', dataSources.getPrices, options || {});
};

export { getPrices };
