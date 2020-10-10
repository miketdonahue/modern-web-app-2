import { secureApi } from '@server/middleware/app-middleware';
import * as controller from './controller';

export default {
  path: '/api/v1/payments',
  middleware: [secureApi],
  routes: [
    {
      path: '/session',
      method: 'post',
      controller: controller.createPaymentSession,
    },
  ],
};
