import { Request, Response, NextFunction } from 'express';
import { getManager } from '@server/modules/db-manager';
import jwt from 'jsonwebtoken';
import Cookies from 'universal-cookie';
import { logger } from '@server/modules/logger';
import { config } from '@config';
import { transformRoleForToken } from '@server/modules/utilities';
import { Role } from '@server/entities/role';

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
  return verifyJwt(req, async (err: any, decoded: any) => {
    const db = getManager();

    if (err) {
      if (err.name === 'TokenExpiredError') {
        logger.info('SECURE-PAGE-MIDDLEWARE: Auth token has expired');

        const [actorAccount] = await db.query(
          `
          SELECT
            actor_account.*,
            actor.role_id as role_id
          FROM
            actor_account
            INNER JOIN actor ON actor_account.actor_id = actor.uuid
          WHERE
            actor.uuid = $1
        `,
          [decoded.actor_id]
        );

        if (!actorAccount) {
          logger.info(
            'SECURE-PAGE-MIDDLEWARE: No actor account found, redirecting'
          );

          return res.redirect(302, '/app/login');
        }

        const role = await db.findOne(Role, { uuid: actorAccount.role_id });

        try {
          await jwt.verify(
            actorAccount.refresh_token,
            config.server.auth.jwt.refreshSecret
          );
        } catch (error) {
          return { token: null };
        }

        logger.info(
          { actor_id: actorAccount.actor_id },
          'SECURE-PAGE-MIDDLEWARE: Found valid refresh token'
        );

        const newToken = jwt.sign(
          {
            actor_id: actorAccount.actor_id,
            role: transformRoleForToken(role),
          },
          config.server.auth.jwt.secret,
          { expiresIn: config.server.auth.jwt.expiresIn }
        );

        logger.info(
          { actor_id: actorAccount.actor_id },
          'SECURE-PAGE-MIDDLEWARE: Issuing new auth tokens'
        );

        const [
          tokenHeader = '',
          tokenBody = '',
          tokenSignature = '',
        ] = newToken.split('.');

        // TODO: change to `secure: true` when HTTPS
        res.cookie('token-payload', `${tokenHeader}.${tokenBody}`, {
          path: '/',
          secure: false,
        });

        res.cookie('token-signature', tokenSignature, {
          path: '/',
          httpOnly: true,
          secure: false,
        });

        logger.info('SECURE-PAGE-MIDDLEWARE: Authenticating user');

        // Add the decoded actor to req for continued access
        (req as any).actor = decoded;
        return next();
      }

      logger.info({ err }, 'SECURE-PAGE-MIDDLEWARE: Token error, redirecting');
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
