import { useQuery, QueryConfig, QueryResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { GetProductVideo } from '@typings/api/product';
import { ErrorResponse } from '@modules/api-response';
import * as dataSources from '@modules/data-sources/product-videos';

type ProductVideosBGetBy = { productSlug?: string };

export const useGetProductVideos = (
  getBy: ProductVideosBGetBy,
  options?: QueryConfig<
    AxiosResponse<GetProductVideo[]>,
    AxiosError<ErrorResponse>
  >
): QueryResult<AxiosResponse<GetProductVideo[]>, AxiosError<ErrorResponse>> => {
  return useQuery(
    '/api/v1/product-videos',
    () => dataSources.getProductVideos({ productSlug: getBy.productSlug }),
    options || {}
  );
};
