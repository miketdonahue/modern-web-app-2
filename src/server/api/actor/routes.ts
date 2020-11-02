import { secureApi } from '@server/middleware/app-middleware';
import * as controller from './controller';

export default {
  path: '/api/v1/',
  middleware: [secureApi],
  routes: [
    {
      path: '/actor/books',
      method: 'get',
      controller: controller.getActorBooks,
    },
  ],
};
