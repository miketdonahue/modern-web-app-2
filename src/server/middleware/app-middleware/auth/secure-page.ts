import { Request, Response, NextFunction } from 'express';
import Cookies from 'universal-cookie';
import { logger } from '@server/modules/logger';
import { config } from '@config';
import { verifyJwt, verifyRefreshToken } from './verify-tokens';

/**
 * Checks if a user is authenticated
 */
const securePageMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  verifyJwt(req.headers?.cookie || '', async (err: any, decoded: any) => {
    const uc = new Cookies(req.headers && req.headers.cookie);
    const uCookies = uc.getAll();

    if (err) {
      if (err.name === 'TokenExpiredError') {
        logger.info('SECURE-PAGE-MIDDLEWARE: Auth token has expired');

        const newToken = await verifyRefreshToken(
          uCookies[config.server.auth.jwt.tokenNames.refresh]
        );

        if (!newToken) {
          logger.warn(
            'SECURE-PAGE-MIDDLEWARE: Refresh token error, redirecting'
          );

          return res.redirect(302, '/app/login');
        }

        // TODO: change to `secure: true` when HTTPS
        res.cookie(
          config.server.auth.jwt.tokenNames.payload,
          `${newToken.header}.${newToken.body}`,
          {
            path: '/',
            secure: false,
          }
        );

        res.cookie(
          config.server.auth.jwt.tokenNames.signature,
          newToken.signature,
          {
            path: '/',
            httpOnly: true,
            secure: false,
          }
        );

        logger.info('SECURE-PAGE-MIDDLEWARE: Authenticating user');

        // Add the decoded actor to req for continued access
        (req as any).actor = decoded;
        return next();
      }

      logger.warn({ err }, 'SECURE-PAGE-MIDDLEWARE: Token error, redirecting');
      return res.redirect(302, '/app/login');
    }

    logger.info(`AUTHENTICATE-MIDDLEWARE: Authenticating user`);

    // Add the decoded actor to req for continued access
    (req as any).actor = decoded;
    return next();
  });

export const securePage = {
  name: 'secure-page',
  function: securePageMiddleware,
};
