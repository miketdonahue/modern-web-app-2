import { secureApi } from '@server/middleware/app-middleware';
import * as controller from './controller';

export default {
  path: '/api/v1/actor',
  middleware: [secureApi],
  routes: [
    {
      path: '/courses',
      method: 'get',
      controller: controller.getActorCourses,
    },
  ],
};
