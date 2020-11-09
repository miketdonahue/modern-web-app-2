import { getManager } from '@server/modules/db-manager';
import jwt from 'jsonwebtoken';
import Cookies from 'universal-cookie';
import { logger } from '@server/modules/logger';
import { config } from '@config';
import { transformRoleForToken } from '@server/modules/utilities';
import { Role } from '@server/entities/role';

/**
 * Verifies a token and passes a callback
 */
export const verifyJwt = (
  cookies: string,
  onVerify: (err: any, decoded: any) => void
) => {
  const uc = new Cookies(cookies);
  const uCookies = uc.getAll();
  const tokenPayload = config.server.auth.jwt.tokenNames.payload;
  const tokenSignature = config.server.auth.jwt.tokenNames.signature;

  const constructedToken =
    uCookies &&
    uCookies[tokenPayload] &&
    uCookies[tokenSignature] &&
    `${uCookies[tokenPayload]}.${uCookies[tokenSignature]}`;

  return jwt.verify(
    constructedToken,
    process.env.JWT_SECRET || '',
    (err: any, decoded: any) => {
      return onVerify(err, decoded);
    }
  );
};

/**
 * Uses a given refresh token and if valid, returns new auth tokens
 */
export const verifyRefreshToken = async (refreshToken: string) => {
  const db = getManager();

  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || '');
  } catch (err) {
    logger.warn({ err }, 'USE-REFRESH-TOKEN: Could not verify refresh token');
    return undefined;
  }

  const [actorAccount] = await db.query(
    `
    SELECT
      actor_account.*,
      actor.role_id as role_id
    FROM
      actor_account
      JOIN actor ON actor_account.actor_id = actor.id
    WHERE
      actor_account.refresh_token = $1
  `,
    [refreshToken]
  );

  if (!actorAccount) {
    return undefined;
  }

  const role = await db.findOne(Role, { id: actorAccount.role_id });

  const newToken = jwt.sign(
    {
      id: actorAccount.actor_id,
      role: transformRoleForToken(role),
    },
    process.env.JWT_SECRET || '',
    { expiresIn: config.server.auth.jwt.expiresIn }
  );

  logger.info(
    { actor_id: actorAccount.actor_id },
    'USE-REFRESH-TOKEN: Issuing new auth tokens'
  );

  const [header = '', body = '', signature = ''] = newToken.split('.');

  return {
    header,
    body,
    signature,
  };
};
