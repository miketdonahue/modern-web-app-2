import jwt from 'jsonwebtoken';
import config from '@config';
import logger from '@server/modules/logger';

/**
 * Checks if a user is authenticated
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {Boolean} - If authenticated or not
 */
const authenticate = (headers): any => {
  // Skip authentication if auth is turned off
  if (!config.server.auth.enabled) {
    return true;
  }

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
    const user = { decoded: null, token };

    if (err) {
      logger.warn({ err }, `AUTHENTICATE-MIDDLEWARE: ${err.message}`);
    }

    // Add the decoded user to context for continued access
    user.decoded = decoded;
    return user;
  });
};

export default authenticate;
