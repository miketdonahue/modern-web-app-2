import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Cookies from 'universal-cookie';
import { ApiResponseWithError } from '@modules/api-response';
import { errorTypes } from '@server/modules/errors';
import { logger } from '@server/modules/logger';
import { config } from '@config';

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
  const constructedToken =
    uCookies && uCookies['token-signature']
      ? `${token}.${uCookies['token-signature']}`
      : token;

  return jwt.verify(
    constructedToken,
    config.server.auth.jwt.secret,
    (err: any, decoded: any) => {
      if (err) {
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
      (req as any).user = decoded;
      return next();
    }
  );
};

export const secureApi = { name: 'secure-api', function: secureApiMiddleware };
