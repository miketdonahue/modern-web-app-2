import { logger } from '@server/modules/logger';

/**
 * Resolves "user account" relation
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns undefined
 */
const actorAccount = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
  logger.info('USER-RESOLVER: Retrieving user account relation');
  return context.prisma.user({ email: parent.email }).userAccount();
};

/**
 * Resolves "user" relation
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns undefined
 */
const actor = async (parent: any, args: any, context: any): Promise<any> => {
  logger.info('USER-RESOLVER: Retrieving user relation');
  return context.prisma.user({ where: { userAccount: { id: parent.id } } });
};

/**
 * Resolves "security questions" relation
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns undefined
 */
const securityQuestions = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
  logger.info('USER-RESOLVER: Retrieving security questions relation');
  return context.prisma.securityQuestionAnswers({
    where: { userAccount: { user: { id: parent.id } } },
  });
};

export default {
  Actor: { actorAccount },
  ActorAccount: { actor, securityQuestions },
};
