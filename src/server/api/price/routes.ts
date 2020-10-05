import * as controller from './controller';

export default {
  path: '/api/v1/prices',
  routes: [
    {
      path: '/',
      method: 'get',
      controller: controller.getPrices,
    },
  ],
};
