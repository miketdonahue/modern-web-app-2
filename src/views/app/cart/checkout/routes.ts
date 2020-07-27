import { securePage } from '@server/middleware/app-middleware';

export default {
  path: '/app/cart',
  routes: [
    {
      path: '/checkout',
      page: '/app/cart/checkout',
      middleware: [securePage],
    },
  ],
};
