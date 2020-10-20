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
      path: '/:cartId/add-item',
      method: 'post',
      controller: controller.addCartItem,
    },
    {
      path: '/:cartId/increment-item',
      method: 'post',
      controller: controller.incrementCartItem,
    },
    {
      path: '/:cartId/decrement-item',
      method: 'post',
      controller: controller.decrementCartItem,
    },
    {
      path: '/:cartId/remove-item',
      method: 'post',
      controller: controller.removeCartItem,
    },
    {
      path: '/:cartId/sync',
      method: 'patch',
      controller: controller.syncCartItems,
    },
  ],
};
