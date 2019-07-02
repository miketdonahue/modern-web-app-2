import config from '@config';
import logger from '@server/modules/logger';

/**
 * Logs metadata for each GraphQL resolver request
 *
 * @remarks
 * This is a GraphQL middleware
 *
 * @param resolve - Promise resolve() method
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns A resolved Promise
 */
const resolverLogger = (resolve, parent, args, context, info): any => {
  const cuid =
    (config.server.auth.enabled && context.user && context.user.cuid) || null;

  logger.info({ cuid, args }, `Metadata for resolver: ${info.fieldName}`);

  return resolve();
};

export default resolverLogger;
