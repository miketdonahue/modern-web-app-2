import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Cookies from 'universal-cookie';
import { logger } from '@server/modules/logger';
import { config } from '@config';

export const verifyJwt = (
  req: Request,
  onVerify: (err: any, decoded: any) => void
) => {
  const uc = new Cookies(req.headers && req.headers.cookie);
  const uCookies = uc.getAll();

  const constructedToken =
    uCookies &&
    uCookies['token-payload'] &&
    uCookies['token-signature'] &&
    `${uCookies['token-payload']}.${uCookies['token-signature']}`;

  return jwt.verify(
    constructedToken,
    config.server.auth.jwt.secret,
    (err: any, decoded: any) => {
      return onVerify(err, decoded);
    }
  );
};

/**
 * Checks if a user is authenticated
 */
const securePageMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return verifyJwt(req, (err: any, decoded: any) => {
    if (err) {
      return res.redirect(302, '/app/login');
    }

    logger.info(`AUTHENTICATE-MIDDLEWARE: Authenticating user`);

    // Add the decoded actor to req for continued access
    (req as any).actor = decoded;
    return next();
  });
};

export const securePage = {
  name: 'secure-page',
  function: securePageMiddleware,
};
