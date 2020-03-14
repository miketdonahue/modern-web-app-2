import { logger } from '@server/modules/logger';
import { config } from '@config';

/**
 * Logs metadata for each GraphQL resolver request
 *
 * @remarks
 * This is a GraphQL middleware
 *
 * @param resolve - Promise resolve() method
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns A resolved Promise
 */
const resolverLogger = (
  resolve: any,
  parent: any,
  args: any,
  context: any,
  info: any
): any => {
  const actorId =
    (config.server.auth.enabled && context.actor && context.actor.actorId) ||
    null;

  logger.info({ actorId, args }, `Metadata for resolver: ${info.fieldName}`);

  return resolve();
};

export { resolverLogger };
