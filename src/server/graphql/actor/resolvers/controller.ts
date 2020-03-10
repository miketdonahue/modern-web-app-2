import { logger } from '@server/modules/logger';
import { Actor } from '@server/entities/actor';

/**
 * Updates a user
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns A user object
 */
const updateUser = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
  const { db } = context;

  logger.info('USER-RESOLVER: Updating user');

  const actor = await db.update(
    Actor,
    { id: args.input.actorId },
    { data: { ...args.input.data } }
  );

  return { ...actor };
};

export default {
  Mutation: {
    updateUser,
  },
};
