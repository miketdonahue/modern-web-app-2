import { securePage } from '@server/middleware/app-middleware';

export default {
  path: '/app/account',
  middleware: [securePage],
  routes: [
    {
      path: '/my-books',
      page: '/app/account/my-books',
    },
  ],
};
