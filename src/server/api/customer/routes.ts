import { secureApi } from '@server/middleware/app-middleware';
import * as controller from './controller';

export default {
  path: '/api/v1/customers',
  middleware: [secureApi],
  routes: [
    {
      path: '/',
      method: 'post',
      controller: controller.createCustomer,
    },
  ],
};
