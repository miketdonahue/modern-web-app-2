import logger from '@server/modules/logger';

/**
 * Resolves a "role" relation
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns undefined
 */
const role = async (parent, args, context, info): Promise<any> => {
  logger.info('ROLE-RESOLVER: Retrieving user role relation');
  return context.prisma.user({ email: parent.email }).role();
};

export default {
  Actor: { role },
};
