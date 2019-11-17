import { rule } from 'graphql-shield';
import isBefore from 'date-fns/is_before';
import { InternalError } from '@server/modules/errors';
import config from '@config';
import { ActorAccount } from '@server/entities/actor-account';

/**
 * Checks if user account has been locked
 *
 * @remarks
 * This is a rule for GraphQL Shield
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns A boolean
 */
export const accountUnlocked = rule()(async (parent, args, context, info) => {
  if (!config.server.auth.lockable.enabled) {
    return true;
  }

  const userAccount = await context.prisma
    .user({
      email: args.input.email,
    })
    .userAccount();

  if (!userAccount) {
    return new InternalError('INVALID_ACTOR_INPUT', { args });
  }

  if (userAccount.locked) {
    // TODO: need to add locked code and expires at
    throw new InternalError('ACCOUNT_LOCKED');

    // await db.update(
    //   ActorAccount,
    //   { uuid: actorAccount.uuid },
    //   {
    //     locked_code: generateCode(),
    //     locked_expires: String(
    //       addHours(new Date(), config.server.auth.codes.expireTime.locked)
    //     ),
    //   }
    // );
  }

  return true;
});

/**
 * Checks if user account locked code has expired
 *
 * @remarks
 * This is a rule for GraphQL Shield
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
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
 * Checks if user account reset password code has expired
 *
 * @remarks
 * This is a rule for GraphQL Shield
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
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
