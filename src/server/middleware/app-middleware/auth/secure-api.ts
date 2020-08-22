import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Cookies from 'universal-cookie';
import { ApiResponseWithError } from '@modules/api-response';
import { errorTypes } from '@server/modules/errors';
import { logger } from '@server/modules/logger';
import { config } from '@config';
import { verifyRefreshToken } from '@server/middleware/app-middleware';

/**
 * Checks if a user is authenticated
 */
const secureApiMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = '';
  const headerParts =
    (req.headers.authorization && req.headers.authorization.split(' ')) || [];

  if (headerParts.length === 2) {
    const scheme = headerParts[0];
    const credentials = headerParts[1];

    if (/^Bearer$/i.test(scheme)) {
      token = credentials;
    }
  }

  const uc = new Cookies(req.headers && req.headers.cookie);
  const uCookies = uc.getAll();
  const tokenSignature = config.server.auth.jwt.tokenNames.signature;

  const constructedToken =
    uCookies && uCookies[tokenSignature]
      ? `${token}.${uCookies[tokenSignature]}`
      : token;

  return jwt.verify(
    constructedToken,
    config.server.auth.jwt.secret,
    async (err: any, decoded: any) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          logger.info('SECURE-API-MIDDLEWARE: Auth token has expired');

          const newToken = await verifyRefreshToken(
            uCookies[config.server.auth.jwt.tokenNames.refresh]
          );

          if (!newToken) {
            logger.warn(
              'SECURE-API-MIDDLEWARE: Refresh token error, redirecting'
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

          logger.info('SECURE-API-MIDDLEWARE: Authenticating user');

          // Add the decoded actor to req for continued access
          (req as any).actor = decoded;
          return next();
        }

        logger.error(
          { err },
          `AUTHENTICATE-MIDDLEWARE: Failed to verify token`
        );

        const response: ApiResponseWithError = {
          error: [
            {
              status: '401',
              code: errorTypes.UNAUTHENTICATED.code,
              detail: errorTypes.UNAUTHENTICATED.detail,
            },
          ],
        };

        return res.status(401).json(response);
      }

      logger.info(`AUTHENTICATE-MIDDLEWARE: Authenticating user`);

      // Add the decoded actor to req for continued access
      (req as any).actor = decoded;
      return next();
    }
  );
};

export const secureApi = { name: 'secure-api', function: secureApiMiddleware };
