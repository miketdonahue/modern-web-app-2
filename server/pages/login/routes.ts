import { oauth } from '@server/middleware';

export default [
  {
    route: '/login',
    page: 'login',
  },
  {
    route: '/oauth/google',
    controller: oauth.google.authorize,
  },
  {
    route: '/oauth/google/callback',
    middleware: [oauth.google.verify()],
    controller: oauth.google.authenticate,
  },
];
