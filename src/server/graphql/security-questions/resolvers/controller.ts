import { logger } from '@server/modules/logger';

/**
 * Retrieves available security questions
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns An array of security question objects
 */
const getSecurityQuestions = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
  logger.info('SECURITY-QUESTION-RESOLVER: Retrieving security questions');
  return context.prisma.securityQuestions();
};

export default {
  Query: { getSecurityQuestions },
};
