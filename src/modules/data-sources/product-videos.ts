import { AxiosResponse } from 'axios';
import { request } from '@modules/request';
import { GetProductVideo } from '@typings/api/product-video';

type GetProductVideosPayload = {
  productSlug?: string;
  lessonSlug?: string;
};

type SetProductVideosPayload = {
  productVideoId?: string;
};

const getProductVideos = async ({
  productSlug,
  lessonSlug,
}: GetProductVideosPayload): Promise<AxiosResponse<GetProductVideo[]>> => {
  const response = await request.get('/api/v1/product-videos', {
    params: {
      ...(productSlug && { product_slug: productSlug }),
      ...(lessonSlug && { lesson_slug: lessonSlug }),
    },
  });

  return response.data;
};

const setProductVideoWatched = async ({
  productVideoId,
}: SetProductVideosPayload): Promise<AxiosResponse<GetProductVideo>> => {
  const response = await request.post(
    `/api/v1/product-videos/${productVideoId}/watched`
  );

  return response.data;
};

export { getProductVideos, setProductVideoWatched };
