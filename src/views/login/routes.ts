import { oauth } from '@server/middleware/app-middleware';

export default {
  path: '/',
  routes: [
    {
      path: '/login',
      page: '/login',
    },
    {
      path: '/oauth/google',
      method: 'get',
      controller: oauth.google.authorize,
    },
    {
      path: '/oauth/google/callback',
      method: 'get',
      middleware: [oauth.google.verify],
      controller: oauth.google.authenticate,
    },
  ],
};
