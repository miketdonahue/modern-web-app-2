import { logger } from '@server/modules/logger';

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
  logger.info('USER-RESOLVER: Updating user');
  const user = await context.prisma.updateUser({
    data: { ...args.input.data },
    where: { id: args.input.userId },
  });

  return { ...user };
};

export default {
  Mutation: {
    updateUser,
  },
};
