import { secureApi } from '@server/middleware/app-middleware';
import * as controller from './controller';

export default {
  path: '/api/v1/carts',
  middleware: [secureApi],
  routes: [
    {
      path: '/me',
      method: 'get',
      controller: controller.getMine,
    },
    {
      path: '/',
      method: 'post',
      controller: controller.createCart,
    },
    {
      path: '/:cartId/items',
      method: 'post',
      controller: controller.createCartItems,
    },
  ],
};
