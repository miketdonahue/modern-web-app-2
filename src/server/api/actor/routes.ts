import { secureApi } from '@server/middleware/app-middleware';
import * as controller from './controller';

export default {
  path: '/api/v1/actors',
  routes: [
    {
      path: '/:id/cart-items',
      method: 'get',
      middleware: [secureApi],
      controller: controller.getActorCartItems,
    },
  ],
};
