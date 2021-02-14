import {
  useQuery,
  useMutation,
  QueryClient,
  UseQueryOptions,
  UseQueryResult,
  UseMutationOptions,
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
  options?: UseQueryOptions<
    AxiosResponse<GetProductVideo[]>,
    AxiosError<ErrorResponse>
  >
): UseQueryResult<
  AxiosResponse<GetProductVideo[]>,
  AxiosError<ErrorResponse>
> =>
  useQuery(
    '/api/v1/product-videos',
    () =>
      dataSources.getProductVideos({
        productSlug: getBy.productSlug,
        lessonSlug: getBy.lessonSlug,
      }),
    options || {}
  );

export const useSetProductVideoWatched = (
  options?: UseMutationOptions<
    AxiosResponse<Partial<GetProductVideo>>,
    AxiosError<ErrorResponse>,
    { productVideoId: string }
  >
) => {
  const queryClient = new QueryClient();

  return useMutation(dataSources.setProductVideoWatched, {
    onMutate: (data) => {
      queryClient.cancelQueries('/api/v1/product-videos');
      const previousRecords = queryClient.getQueryData(
        '/api/v1/product-videos'
      );

      queryClient.setQueryData('/api/v1/product-videos', (records: any) => {
        const recordToUpdate = records.data.find(
          (item: GetProductVideo) => item.attributes.id === data.productVideoId
        );

        if (recordToUpdate?.meta) {
          recordToUpdate.meta.watched = true;
        }

        return records;
      });

      return () =>
        queryClient.setQueryData('/api/v1/product-videos', previousRecords);
    },
    onSettled: (data, error, variables, onMutateValue) => {
      queryClient.invalidateQueries('/api/v1/product-videos');

      if (options?.onSettled)
        options.onSettled(data, error, variables, onMutateValue);
    },
    ...options,
  });
};
