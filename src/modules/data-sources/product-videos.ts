import { AxiosResponse } from 'axios';
import { request } from '@modules/request';
import { GetProductVideo } from '@typings/api/product';

type GetProductVideosPayload = {
  productSlug?: string;
};

const getProductVideos = async ({
  productSlug,
}: GetProductVideosPayload): Promise<AxiosResponse<GetProductVideo[]>> => {
  const response = await request.get('/api/v1/product-videos', {
    params: {
      ...(productSlug && { product_slug: productSlug }),
    },
  });

  return response.data;
};

export { getProductVideos };
