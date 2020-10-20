import { secureApi } from '@server/middleware/app-middleware';
import * as controller from './controller';

export default {
  path: '/api/v1/actor',
  routes: [
    {
      path: '/me',
      method: 'get',
      middleware: [secureApi],
      controller: controller.getMe,
    },
    {
      path: '/reset-password',
      method: 'post',
      controller: controller.resetPassword,
    },
    {
      path: '/unlock-account',
      method: 'post',
      controller: controller.unlockActorAccount,
    },
    {
      path: '/:id/cart-items',
      method: 'get',
      middleware: [secureApi],
      controller: controller.getActorCartItems,
    },
  ],
};
