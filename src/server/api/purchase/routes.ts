import { secureApi } from '@server/middleware/app-middleware';
import * as controller from './controller';

export default {
  path: '/api/v1/purchases',
  middleware: [secureApi],
  routes: [
    {
      path: '/',
      method: 'get',
      controller: controller.getPurchases,
    },
  ],
};
