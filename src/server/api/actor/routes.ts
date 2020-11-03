import { secureApi } from '@server/middleware/app-middleware';
import * as controller from './controller';

export default {
  path: '/api/v1/actor',
  middleware: [secureApi],
  routes: [
    {
      path: '/books',
      method: 'get',
      controller: controller.getActorBooks,
    },
  ],
};
