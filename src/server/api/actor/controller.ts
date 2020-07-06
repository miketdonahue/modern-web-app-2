import { Request, Response } from 'express';
import { logger } from '@server/modules/logger';
import { ActorAccount } from '@server/entities/actor-account';

/**
 * Unlock account
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const getMe = async (req: Request, res: Response) => {
  return res.json({ id: '123' });
};

/**
 * Unlock account
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const unlockActorAccount = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
  const { db } = context;

  logger.info('AUTH-RESOLVER: Unlocking account');
  const updatedActorAccount = await db
    .createQueryBuilder()
    .update(ActorAccount)
    .set({
      locked: false,
      locked_code: null,
      locked_expires: null,
      login_attempts: 0,
    })
    .where('locked_code = :lockedCode', {
      lockedCode: args.input.code,
    })
    .returning('actor_id')
    .execute();

  const [actorAccount] = updatedActorAccount.raw;

  return { actorId: actorAccount.actor_id };
};

export { getMe, unlockActorAccount };
