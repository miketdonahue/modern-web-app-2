import { securePage } from '@server/middleware/app-middleware';

export default {
  path: '/app/order-complete',
  middleware: [securePage],
  routes: [
    {
      path: '/',
      page: '/app/order-complete',
    },
  ],
};
