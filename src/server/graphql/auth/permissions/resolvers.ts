import { rule } from 'graphql-shield';
import { isBefore, addHours } from 'date-fns';
import { InternalError } from '@server/modules/errors';
import generateCode from '@server/modules/code';
import { ActorAccount } from '@server/entities/actor-account';
import config from '@config';

/**
 * Checks if actor account has been locked
 *
 * @remarks
 * This is a rule for GraphQL Shield
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns A boolean
 */
export const accountUnlocked = rule()(async (parent, args, context, info) => {
  if (!config.server.auth.lockable.enabled) {
    return true;
  }

  const { db } = context;
  const [actorAccount] = await db.query(
    `
    SELECT
      actor_account.*
    FROM
      actor_account
      INNER JOIN actor ON actor_account.actor_id = actor.uuid
    WHERE
      actor.email = $1
  `,
    [args.input.email]
  );

  if (!actorAccount) {
    return new InternalError('INVALID_ACTOR_INPUT', { args });
  }

  if (actorAccount.locked) {
    await db.update(
      ActorAccount,
      { uuid: actorAccount.uuid },
      {
        locked_code: generateCode(),
        locked_expires: addHours(
          new Date(),
          config.server.auth.codes.expireTime.locked
        ),
      }
    );

    throw new InternalError('ACCOUNT_LOCKED');
  }

  return true;
});

/**
 * Checks if actor account locked code has expired
 *
 * @remarks
 * This is a rule for GraphQL Shield
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns A boolean
 */
export const lockedCodeNotExpired = rule()(
  async (parent, args, context, info) => {
    const { db } = context;

    const actorAccount = await db.findOne(ActorAccount, {
      locked_code: args.input.code,
    });

    if (!actorAccount) {
      throw new InternalError('CODE_NOT_FOUND', { code: 'lockedCode' });
    }

    if (isBefore(actorAccount.locked_expires, new Date())) {
      return new InternalError('LOCKED_CODE_EXPIRED');
    }

    return true;
  }
);

/**
 * Checks if actor account reset password code has expired
 *
 * @remarks
 * This is a rule for GraphQL Shield
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns A boolean
 */
export const resetPasswordCodeNotExpired = rule()(
  async (parent, args, context, info) => {
    const { db } = context;

    const actorAccount = await db.findOne(ActorAccount, {
      reset_password_code: args.input.code,
    });

    if (!actorAccount) {
      throw new InternalError('CODE_NOT_FOUND', { code: 'resetPasswordCode' });
    }

    if (isBefore(actorAccount.reset_password_expires, new Date())) {
      return new InternalError('RESET_PASSWORD_CODE_EXPIRED');
    }

    return true;
  }
);
