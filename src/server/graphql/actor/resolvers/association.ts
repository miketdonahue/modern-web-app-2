import { logger } from '@server/modules/logger';
import { Actor } from '@server/entities/actor';
import { SecurityQuestionAnswer } from '@server/entities/security-question-answer';

/**
 * Resolves "user account" relation
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
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

  const [result] = await context.db.query(
    `
      SELECT
        actor_account.*
      FROM
        actor
        INNER JOIN actor_account ON actor.id = actor_account.actor_id
      WHERE
        actor.email = $1
    `,
    [parent.email]
  );

  return result;
};

/**
 * Resolves a "role" relation
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns undefined
 */
const role = async (parent: any, args: any, context: any): Promise<any> => {
  logger.info('ROLE-RESOLVER: Retrieving user role relation');

  const [actorRole] = await context.db.query(
    `
      SELECT
        role.*
      FROM
        actor
        INNER JOIN role ON actor.id = role.id
      WHERE
        actor.email = $1
    `,
    [parent.email]
  );

  return actorRole;
};

/**
 * Resolves "actor" relation
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns undefined
 */
const actor = async (parent: any, args: any, context: any): Promise<any> => {
  logger.info('USER-RESOLVER: Retrieving actor relation');

  return context.db.findOne(Actor, { id: parent.actor_id });
};

/**
 * Resolves "security questions" relation
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
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

  return context.db.find(SecurityQuestionAnswer, {
    actor_account_id: parent.id,
  });
};

export default {
  Actor: { actorAccount, role },
  ActorAccount: { actor, securityQuestions },
};
