import { securePage } from '@server/middleware/app-middleware';

export default {
  path: '/app/courses',
  middleware: [securePage],
  routes: [
    {
      path: '/',
      page: '/app/courses',
    },
    {
      path: '/:slug',
      page: '/app/courses/[slug]',
    },
  ],
};
