import { Request, Response } from 'express';
import { securePage } from '@server/middleware/app-middleware';

export default {
  path: '/app/lessons',
  middleware: [securePage],
  routes: [
    {
      path: '/',
      method: 'get',
      // Intentional redirect to /courses because /lessons is not a page that adds value by itself
      controller: (_req: Request, res: Response) => {
        res.redirect(302, '/app/courses');
      },
    },
    {
      path: '/:id',
      page: '/app/lessons/[id]',
    },
  ],
};
