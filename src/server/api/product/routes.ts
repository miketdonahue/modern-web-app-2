import * as controller from './controller';

export default {
  path: '/api/v1/products',
  routes: [
    {
      path: '/',
      method: 'get',
      controller: controller.getProducts,
    },
  ],
};
