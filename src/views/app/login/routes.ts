import { oauth } from '@server/middleware/app-middleware';
import { verifyJwt } from '@server/middleware/app-middleware/secure-page';

export default {
  path: '/app',
  routes: [
    {
      path: '/login',
      page: '/app/login',
      middleware: [
        {
          name: 'redirect-page',
          function: (req: any, res: any, next: any) => {
            verifyJwt(req, (err: any) => {
              if (err) {
                /* If error on verifying, continue to /login */
                return next();
              }

              if (req.originalUrl === '/app/login') {
                /* If already authenticated, redirect to app */
                return res.redirect(302, '/app');
              }

              return next();
            });
          },
        },
      ],
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
