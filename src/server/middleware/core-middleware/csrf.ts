import { Request, Response, NextFunction } from 'express';
import csrfSecurity from 'csurf';
import { config } from '@config';

const { middleware } = config.server;

/**
 * CSRF Security Middleware
 *
 * @remarks
 *
 * https://github.com/expressjs/csurf
 */
export const csrf = {
  name: 'csrf',
  function: (req: Request, res: Response, next: NextFunction) => {
    return csrfSecurity(middleware.csrf)(req, res, next);
  },
};
