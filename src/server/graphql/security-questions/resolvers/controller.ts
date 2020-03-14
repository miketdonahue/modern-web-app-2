import { logger } from '@server/modules/logger';
import { SecurityQuestion } from '@server/entities/security-question';

/**
 * Retrieves available security questions
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
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
  return context.db.find(SecurityQuestion);
};

export default {
  Query: { getSecurityQuestions },
};
