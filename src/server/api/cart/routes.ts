import { secureApi } from '@server/middleware/app-middleware';
import * as controller from './controller';

export default {
  path: '/api/v1/carts',
  middleware: [secureApi],
  routes: [
    {
      path: '/',
      method: 'post',
      controller: controller.createCart,
    },
    {
      path: '/:cartId/sync',
      method: 'patch',
      controller: controller.syncCartItems,
    },
  ],
};
