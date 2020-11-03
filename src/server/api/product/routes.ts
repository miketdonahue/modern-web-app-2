import { secureApi } from '@server/middleware/app-middleware';
import * as controller from './controller';

export default {
  path: '/api/v1/products',
  routes: [
    {
      path: '/',
      method: 'get',
      controller: controller.getProducts,
    },
    {
      path: '/:id/download',
      method: 'get',
      middleware: [secureApi],
      controller: controller.downloadProduct,
    },
  ],
};
