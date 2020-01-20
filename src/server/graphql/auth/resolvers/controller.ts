import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { addHours } from 'date-fns';
import uuid from 'uuid/v4';
import generateCode from '@server/modules/code';
import { InternalError, ExternalError } from '@server/modules/errors';
import logger from '@server/modules/logger';
import { Actor } from '@server/entities/actor';
import { ActorAccount } from '@server/entities/actor-account';
import { Role, RoleName } from '@server/entities/role';
import { SecurityQuestion } from '@server/entities/security-question';
import { SecurityQuestionAnswer } from '@server/entities/security-question-answer';
import { BlacklistedToken } from '@server/entities/blacklisted-token';
import {
  WELCOME_EMAIL,
  CONFIRMATION_EMAIL,
  UNLOCK_ACCOUNT_EMAIL,
} from '@server/modules/mailer';
import config from '@config';
import { transformRoleForToken } from '../utilities';

// TODO: wrap calls in try/catch

/**
 * Registers a new actor
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns token
 */
const registerActor = async (parent, args, context, info): Promise<any> => {
  const { db, req, mailer } = context;
  const role = await db.findOne(Role, { name: RoleName.ACTOR });

  logger.info('AUTH-RESOLVER: Hashing password');
  const password = await argon2.hash(args.input.password, {
    timeCost: 2000,
    memoryCost: 500,
  });

  const actor = await db.transaction(
    async (transactionalEntityManager: any) => {
      logger.info('AUTH-RESOLVER: Creating actor');
      const createdActor = await transactionalEntityManager.create(Actor, {
        role_id: role.uuid,
        first_name: args.input.firstName,
        last_name: args.input.lastName,
        email: args.input.email,
        password,
      });

      await transactionalEntityManager.save(createdActor);

      logger.info('AUTH-RESOLVER: Creating actor account');
      const createdActorAccount = await db.create(ActorAccount, {
        actor_id: createdActor.uuid,
        confirmed_code: config.server.auth.confirmable ? generateCode() : null,
        last_visit: new Date(),
        ip: req.ip,
      });

      await transactionalEntityManager.save(createdActorAccount);

      return createdActor;
    }
  );

  logger.info('AUTH-RESOLVER: Signing token');
  const token = jwt.sign(
    { actorId: actor.uuid, role: transformRoleForToken(role) },
    config.server.auth.jwt.secret,
    { expiresIn: config.server.auth.jwt.expiresIn }
  );

  const emailType = config.server.auth.confirmable
    ? CONFIRMATION_EMAIL
    : WELCOME_EMAIL;

  logger.info({ emailType }, 'AUTH-RESOLVER: Sending email');
  await mailer.message.sendMessage(actor, emailType);

  return {
    actorId: actor.uuid,
    token,
  };
};

/**
 * Confirms a new actor's account
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const confirmActor = async (parent, args, context, info): Promise<any> => {
  const { db, mailer } = context;

  const actorAccount = await db.findOne(ActorAccount, {
    confirmed_code: args.input.code,
  });

  const actor = await db.findOne(Actor, { uuid: actorAccount.actor_id });

  logger.info('AUTH-RESOLVER: Confirming actor account');
  await db.update(
    ActorAccount,
    { uuid: actorAccount.uuid },
    {
      confirmed: true,
      confirmed_code: null,
    }
  );

  logger.info('AUTH-RESOLVER: Sending welcome email');
  await mailer.message.sendMessage(actor, WELCOME_EMAIL);

  return {
    actorId: actor.uuid,
  };
};

/**
 * Logs in an actor
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns token
 */
const loginActor = async (parent, args, context, info): Promise<any> => {
  const { db } = context;

  const role = await db.findOne(Role, { name: RoleName.ACTOR });
  const [actorAccount] = await db.query(
    `
    SELECT
      actor_account.*,
      actor.password
    FROM
      actor_account
      INNER JOIN actor ON actor_account.actor_id = actor.uuid
    WHERE
      actor.email = $1
  `,
    [args.input.email]
  );

  if (!actorAccount) {
    throw new InternalError('INVALID_CREDENTIALS');
  }

  const passwordMatch = await argon2.verify(
    actorAccount.password,
    args.input.password
  );

  const refreshToken = jwt.sign(
    { hash: uuid() },
    config.server.auth.jwt.refreshSecret,
    {
      expiresIn: config.server.auth.jwt.refreshExpiresIn,
    }
  );

  await db.update(
    ActorAccount,
    { uuid: actorAccount.uuid },
    !passwordMatch
      ? {
          login_attempts: actorAccount.login_attempts + 1,
          locked:
            actorAccount.login_attempts >=
            config.server.auth.lockable.maxAttempts,
        }
      : {
          last_visit: new Date(),
          ip: context.req.ip,
          login_attempts: 0,
          security_question_attempts: 0,
          refresh_token: refreshToken,
        }
  );

  if (!passwordMatch) {
    throw new InternalError('INVALID_CREDENTIALS');
  }

  logger.info('AUTH-RESOLVER: Signing auth tokens');
  const token = jwt.sign(
    { actorId: actorAccount.actor_id, role: transformRoleForToken(role) },
    config.server.auth.jwt.secret,
    { expiresIn: config.server.auth.jwt.expiresIn }
  );

  const dsToken = jwt.sign({ hash: uuid() }, config.server.auth.jwt.dsSecret, {
    expiresIn: config.server.auth.jwt.expiresIn,
  });

  // TODO: change to `secure: true` when HTTPS
  context.res.cookie('token', token, { path: '/', secure: false });
  context.res.cookie('ds_token', dsToken, {
    path: '/',
    httpOnly: true,
    secure: false,
  });

  return {
    actorId: actorAccount.actor_id,
    token,
  };
};

/**
 * Sets a actor's security question answers
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const setActorSecurityQuestionAnswers = async (
  parent,
  args,
  context,
  info
): Promise<any> => {
  const { db } = context;
  const queue: any = [];
  const actorAccount = await db.findOne(ActorAccount, {
    actor_id: args.input.actorId,
  });

  const securityQuestionPayload = async (
    actorAcct: any,
    shortName: any,
    answer: any
  ): Promise<any> => {
    const question = await db.findOne(SecurityQuestion, {
      short_name: shortName,
    });

    return {
      actor_account_id: actorAcct.uuid,
      security_question_id: question.uuid,
      answer,
    };
  };

  if (!actorAccount) {
    throw new InternalError('INVALID_ACTOR_INPUT', { args });
  }

  logger.info("AUTH-RESOLVER: Setting actor's security questions");
  for (const item of args.input.answers) {
    queue.push(
      securityQuestionPayload(actorAccount, item.shortName, item.answer)
    );
  }

  const resolvedAnswers = await Promise.all(queue);

  await db
    .createQueryBuilder()
    .insert()
    .into(SecurityQuestionAnswer)
    .values(resolvedAnswers)
    .onConflict(
      `("actor_account_id", "security_question_id") DO UPDATE SET "answer" = excluded.answer`
    )
    .execute();

  return { actorId: actorAccount.actor_id };
};

/**
 * Retrieve a actor's security question answers
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns An array of answer objects
 */
const getActorSecurityQuestionAnswers = async (
  parent,
  args,
  context,
  info
): Promise<any> => {
  const { db } = context;
  logger.info("AUTH-RESOLVER: Retrieving actor's security question answers");

  const actorAccount = await db.findOne(ActorAccount, {
    actor_id: args.input.actorId,
  });

  const answers = await db.query(
    `
    SELECT
      security_question_answer.*
    FROM
      security_question_answer
      INNER JOIN actor_account ON security_question_answer.actor_account_id = actor_account.uuid
    WHERE
      security_question_answer.actor_account_id = $1
  `,
    [actorAccount.uuid]
  );

  if (!answers) {
    throw new InternalError('INVALID_ACTOR_INPUT', { args });
  }

  return answers;
};

/**
 * Verify a actor's security question answers
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const verifyActorSecurityQuestionAnswers = async (
  parent,
  args,
  context,
  info
): Promise<any> => {
  const { db } = context;
  const queue: any = [];

  const actorAccount = await db.findOne(ActorAccount, {
    actor_id: args.input.actorId,
  });

  const securityQuestionExists = async (
    actorAcctUuid: any,
    shortName: any,
    answer: any
  ): Promise<any> => {
    const securityQuestion = await db.findOne(SecurityQuestion, {
      short_name: shortName,
    });

    const [result] = await db.query(
      `
      SELECT EXISTS(
        SELECT 1
        FROM security_question_answer
        WHERE actor_account_id = $1
          AND security_question_id = $2
          AND answer = $3
      );
      `,
      [actorAcctUuid, securityQuestion.uuid, answer]
    );

    return result.exists;
  };

  for (const item of args.input.answers) {
    queue.push(
      securityQuestionExists(actorAccount.uuid, item.shortName, item.answer)
    );
  }

  const existingSecurityQuestions = await Promise.all(queue);
  const foundAllQuestions = existingSecurityQuestions.every(
    (item: any) => item && item
  );

  if (!foundAllQuestions) {
    await db.update(
      ActorAccount,
      { uuid: actorAccount.uuid },
      {
        security_question_attempts: actorAccount.security_question_attempts + 1,
        locked:
          actorAccount.security_question_attempts >=
          config.server.auth.lockable.maxAttempts,
      }
    );

    throw new InternalError('INVALID_SECURITY_QUESTIONS');
  }

  return { actorId: actorAccount.actor_id };
};

/**
 * Generate a reset token so a actor can reset their password
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const resetPassword = async (parent, args, context, info): Promise<any> => {
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
    throw new InternalError('INVALID_ACTOR_INPUT', { args });
  }

  logger.info("AUTH-RESOLVER: Preparing actor's password for reset");
  await db.update(
    ActorAccount,
    { uuid: actorAccount.uuid },
    {
      reset_password_code: generateCode(),
      reset_password_expires: String(
        addHours(new Date(), config.server.auth.codes.expireTime.passwordReset)
      ),
    }
  );

  return { actorId: actorAccount.actor_id };
};

/**
 * Change password
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const changePassword = async (parent, args, context, info): Promise<any> => {
  const { db } = context;

  const password = await argon2.hash(args.input.password, {
    timeCost: 2000,
    memoryCost: 500,
  });

  logger.info(
    { attrs: ['reset_password_code', 'reset_password_expires'] },
    "AUTH-RESOLVER: Resetting actor's account attributes"
  );

  const updatedActorAccount = await db
    .createQueryBuilder()
    .update(ActorAccount)
    .set({
      reset_password_code: null,
      reset_password_expires: null,
    })
    .where('reset_password_code = :resetPasswordCode', {
      resetPasswordCode: args.input.code,
    })
    .returning('actor_id')
    .execute();

  const [actorAccount] = updatedActorAccount.raw;

  logger.info("AUTH-RESOLVER: Changing actor's password");
  await db.update(
    Actor,
    {
      uuid: actorAccount.actor_id,
    },
    { password }
  );

  return { actorId: actorAccount.actor_id };
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
const unlockAccount = async (parent, args, context, info): Promise<any> => {
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

/**
 * Send an authentication-related email
 *
 * @remarks
 * This is used to resend auth emails
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const sendAuthEmail = async (parent, args, context, info): Promise<any> => {
  const { db, mailer } = context;
  const [actor] = await db.query(
    `
    SELECT
      actor_account.confirmed_code,
      actor_account.locked_code,
      actor.uuid,
      actor.email,
      actor.first_name
    FROM
      actor_account
      INNER JOIN actor ON actor_account.actor_id = actor.uuid
    WHERE
      actor.email = $1
  `,
    [args.input.email]
  );

  const emailType = {
    CONFIRMATION_EMAIL,
    UNLOCK_ACCOUNT_EMAIL,
  };

  logger.info(
    { type: args.input.type },
    'AUTH-RESOLVER: Sending email to actor'
  );

  await mailer.message.sendMessage(actor, (emailType as any)[args.input.type]);

  return { actorId: actor.uuid };
};

/**
 * Logout an actor
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const logoutActor = async (parent, args, context, info): Promise<any> => {
  const { db } = context;

  logger.info('AUTH-RESOLVER: Logging out actor');
  await db.insert(BlacklistedToken, { token: args.input.token });

  return undefined;
};

/**
 * Validates a actor's access
 *
 * @remarks
 * Will issue a new token based on a valid refresh token
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns decoded token
 */
const validateAccess = async (parent, args, context, info): Promise<any> => {
  // Skip authentication if auth is turned off
  if (!config.server.auth.enabled) {
    return true;
  }

  const { db } = context;
  const decoded = jwt.decode(context.actor.token);
  const blacklistedToken = await db.findOne(BlacklistedToken, {
    token: context.actor.token,
  });

  if (blacklistedToken) {
    logger.info('AUTH-RESOLVER: Received blacklisted auth token');
    return { actorId: context.actor.actorId, token: null };
  }

  try {
    jwt.verify(context.actor.token, config.server.auth.jwt.secret);
    jwt.verify(context.req.cookies.ds_token, config.server.auth.jwt.dsSecret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      logger.info('AUTH-RESOLVER: Auth token has expired');

      const [actorAccount] = await db.query(
        `
        SELECT
          actor_account.*,
          actor.role_id as role_id
        FROM
          actor_account
          INNER JOIN actor ON actor_account.actor_id = actor.uuid
        WHERE
          actor.uuid = $1
      `,
        [decoded.actorId]
      );

      if (!actorAccount) {
        throw new InternalError('ACTOR_NOT_FOUND');
      }

      const role = await db.findOne(Role, { uuid: actorAccount.role_id });

      try {
        await jwt.verify(
          actorAccount.refresh_token,
          config.server.auth.jwt.refreshSecret
        );
      } catch (error) {
        return { actorId: actorAccount.actor_id, token: null };
      }

      logger.info(
        { actorId: actorAccount.actor_id },
        'AUTH-RESOLVER: Found valid refresh token'
      );

      const newToken = jwt.sign(
        { actorId: actorAccount.actor_id, role: transformRoleForToken(role) },
        config.server.auth.jwt.secret,
        { expiresIn: config.server.auth.jwt.expiresIn }
      );

      const newDsToken = jwt.sign(
        { hash: uuid() },
        config.server.auth.jwt.dsSecret,
        {
          expiresIn: config.server.auth.jwt.expiresIn,
        }
      );

      logger.info(
        { actorId: actorAccount.actor_id },
        'AUTH-RESOLVER: Issuing new auth tokens'
      );

      context.res.cookie('token', newToken, { path: '/', secure: false });
      context.res.cookie('ds_token', newDsToken, {
        path: '/',
        httpOnly: true,
        secure: false,
      });

      return { actorId: actorAccount.actor_id, token: newToken };
    }

    return { actorId: context.actor.actorId, token: null };
  }

  return { actorId: context.actor.actorId, token: context.actor.token };
};

export default {
  Query: {
    getActorSecurityQuestionAnswers,
    validateAccess,
  },
  Mutation: {
    registerActor,
    confirmActor,
    loginActor,
    setActorSecurityQuestionAnswers,
    verifyActorSecurityQuestionAnswers,
    resetPassword,
    changePassword,
    unlockAccount,
    sendAuthEmail,
    logoutActor,
  },
};
