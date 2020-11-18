import {
  useQuery,
  useMutation,
  queryCache,
  QueryConfig,
  QueryResult,
  MutationConfig,
} from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { ErrorResponse } from '@modules/api-response';
import { GetProductVideo } from '@typings/api/product-video';
import * as dataSources from '@modules/data-sources/product-videos';

type ProductVideosBGetBy = {
  productSlug?: string;
  lessonSlug?: string;
};

export const useGetProductVideos = (
  getBy: ProductVideosBGetBy,
  options?: QueryConfig<
    AxiosResponse<GetProductVideo[]>,
    AxiosError<ErrorResponse>
  >
): QueryResult<AxiosResponse<GetProductVideo[]>, AxiosError<ErrorResponse>> => {
  return useQuery(
    '/api/v1/product-videos',
    () =>
      dataSources.getProductVideos({
        productSlug: getBy.productSlug,
        lessonSlug: getBy.lessonSlug,
      }),
    options || {}
  );
};

export const useSetProductVideoWatched = (
  options?: MutationConfig<
    AxiosResponse<Partial<GetProductVideo>>,
    AxiosError<ErrorResponse>,
    { productVideoId: string }
  >
) => {
  return useMutation(dataSources.setProductVideoWatched, {
    onMutate: (data) => {
      queryCache.cancelQueries('/api/v1/product-videos');
      const previousRecords = queryCache.getQueryData('/api/v1/product-videos');

      queryCache.setQueryData('/api/v1/product-videos', (records: any) => {
        const recordToUpdate = records.data.find(
          (item: GetProductVideo) => item.attributes.id === data.productVideoId
        );

        if (recordToUpdate?.meta) {
          recordToUpdate.meta.watched = true;
        }

        return records;
      });

      return () =>
        queryCache.setQueryData('/api/v1/product-videos', previousRecords);
    },
    onSettled: (data, error, variables, onMutateValue) => {
      queryCache.invalidateQueries('/api/v1/product-videos');

      if (options?.onSettled)
        options.onSettled(data, error, variables, onMutateValue);
    },
    ...options,
  });
};
