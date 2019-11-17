import jwt from 'jsonwebtoken';
import config from '@config';
import logger from '@server/modules/logger';

/**
 * Checks if a user is authenticated
 *
 * @remarks
 * This function verifies a token and attaches the user to req.user
 *
 * @param headers - The application request headers
 * @returns A user object
 */
const authenticate = (headers): any => {
  let token = '';
  const headerParts =
    (headers.authorization && headers.authorization.split(' ')) || [];

  if (headerParts.length === 2) {
    const scheme = headerParts[0];
    const credentials = headerParts[1];

    if (/^Bearer$/i.test(scheme)) {
      token = credentials;
    }
  }

  return jwt.verify(token, config.server.auth.jwt.secret, (err, decoded) => {
    const actor = { decoded: null, token };

    if (err) {
      logger.warn({ err }, `AUTHENTICATE-MIDDLEWARE: ${err.message}`);
    }

    // Add the decoded actor to context for continued access
    actor.decoded = decoded;
    return actor;
  });
};

export default authenticate;
