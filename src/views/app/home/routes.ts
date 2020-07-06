import { securePage } from '@server/middleware/app-middleware';

export default {
  path: '/app',
  routes: [
    {
      path: '/',
      middleware: [securePage],
      page: '/app/index',
    },
  ],
};
