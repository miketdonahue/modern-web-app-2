import { oauth } from '@server/middleware/app-middleware';

export default {
  path: '/app',
  routes: [
    {
      path: '/login',
      page: '/app/login',
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
