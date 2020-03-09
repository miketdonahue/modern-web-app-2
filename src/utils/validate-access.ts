import jwt from 'jsonwebtoken';
import { InternalError } from '@server/modules/errors';
import { logger } from '@server/modules/logger';
import { Role } from '@server/entities/role';
import { BlacklistedToken } from '@server/entities/blacklisted-token';
import { config } from '@config';
import { transformRoleForToken } from '@server/graphql/auth/utilities';

export const validateAccess1 = async context => {
  // Skip authentication if auth is turned off
  if (!config.server.auth.enabled) {
    return true;
  }

  const { db } = context;
  const decoded = jwt.decode(context.actor.token);
  const blacklistedToken = await db.findOne(BlacklistedToken, {
    token: context.actor.token,
  });

  if (blacklistedToken) {
    logger.info('AUTH-RESOLVER: Received blacklisted auth token');
    return { token: null };
  }

  try {
    jwt.verify(context.actor.token, config.server.auth.jwt.secret);
    jwt.verify(context.req.cookies.ds_token, config.server.auth.jwt.dsSecret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      logger.info('AUTH-RESOLVER: Auth token has expired');

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
        [decoded.actorId]
      );

      if (!actorAccount) {
        throw new InternalError('ACTOR_NOT_FOUND');
      }

      const role = await db.findOne(Role, { uuid: actorAccount.role_id });

      try {
        await jwt.verify(
          actorAccount.refresh_token,
          config.server.auth.jwt.refreshSecret
        );
      } catch (error) {
        return { actorId: actorAccount.actor_id, token: null };
      }

      logger.info(
        { actorId: actorAccount.actor_id },
        'AUTH-RESOLVER: Found valid refresh token'
      );

      const newToken = jwt.sign(
        { actorId: actorAccount.actor_id, role: transformRoleForToken(role) },
        config.server.auth.jwt.secret,
        { expiresIn: config.server.auth.jwt.expiresIn }
      );

      logger.info(
        { actorId: actorAccount.actor_id },
        'AUTH-RESOLVER: Issuing new auth tokens'
      );

      const [
        tokenHeader = '',
        tokenBody = '',
        tokenSignature = '',
      ] = newToken.split('.');

      // TODO: change to `secure: true` when HTTPS
      context.res.cookie('token-payload', `${tokenHeader}.${tokenBody}`, {
        path: '/',
        secure: false,
      });

      context.res.cookie('token-signature', tokenSignature, {
        path: '/',
        httpOnly: true,
        secure: false,
      });

      return { token: newToken };
    }

    return { token: null };
  }

  return { token: context.actor.token };
};
