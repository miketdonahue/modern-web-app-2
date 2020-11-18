import { secureApi } from '@server/middleware/app-middleware';
import * as controller from './controller';

export default {
  path: '/api/v1/product-videos',
  routes: [
    {
      path: '/',
      method: 'get',
      middleware: [secureApi],
      controller: controller.getProductVideos,
    },
    {
      path: '/:id/watched',
      method: 'post',
      middleware: [secureApi],
      controller: controller.setProductVideoWatched,
    },
  ],
};
