import { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { addMinutes, addDays } from 'date-fns';
import { v4 as uuid } from 'uuid';
import Cookies from 'universal-cookie';
import { getManager } from '@server/modules/db-manager';
import { decrypt } from '@server/modules/encryption';
import generateCode from '@server/modules/code';
import { InternalError } from '@server/modules/errors';
import { logger } from '@server/modules/logger';
import { resourceTypes, ApiResponse } from '@modules/api-response';
import { Actor } from '@server/entities/actor';
import { ActorAccount } from '@server/entities/actor-account';
import { Role, RoleName } from '@server/entities/role';
import { BlacklistedToken } from '@server/entities/blacklisted-token';
import {
  mailer,
  WELCOME_EMAIL,
  CONFIRM_EMAIL,
  UNLOCK_ACCOUNT_EMAIL,
} from '@server/modules/mailer';
import { config } from '@config';
import { transformRoleForToken } from '@server/modules/utilities';

/**
 * Registers a new actor
 */
const registerActor = async (req: Request, res: Response) => {
  const db = getManager();

  const role = await db.findOne(Role, { name: RoleName.ACTOR });

  logger.info('AUTH-RESOLVER: Hashing password');
  const password = await argon2.hash(req.body.password, {
    timeCost: 2000,
    memoryCost: 500,
  });

  const actorAccount = await db.transaction(
    async (transactionalEntityManager: any) => {
      logger.info('AUTH-RESOLVER: Creating actor');
      const createdActor = await transactionalEntityManager.create(Actor, {
        role_id: role?.uuid,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        password,
      });

      await transactionalEntityManager.save(createdActor);

      logger.info('AUTH-RESOLVER: Creating actor account');
      const createdActorAccount = await db.create(ActorAccount, {
        actor_id: createdActor.uuid,
        confirmed_code: config.server.auth.confirmable ? generateCode() : null,
        confirmed_expires: String(
          addMinutes(new Date(), config.server.auth.codes.expireTime)
        ),
        last_visit: new Date(),
        ip: req.ip,
      });

      await transactionalEntityManager.save(createdActorAccount);

      return createdActorAccount;
    }
  );

  const [actor] = await db.query(
    `
    SELECT
      actor.*,
      actor_account.confirmed_code
    FROM
      actor
      INNER JOIN actor_account ON actor_account.actor_id = actor.uuid
    WHERE
      actor.uuid = $1
  `,
    [actorAccount.actor_id]
  );

  actor.email = decrypt(actor.email);

  logger.info('AUTH-RESOLVER: Signing actor id token');
  const actorIdToken = jwt.sign(
    { actorId: actor.uuid },
    config.server.auth.jwt.secret
  );

  // TODO: change to `secure: true` when HTTPS
  res.cookie('actor', actorIdToken, {
    path: '/',
    secure: false,
  });

  /* Sending emails */
  logger.info(
    { emails: ['welcome', 'confirm-email'] },
    'AUTH-RESOLVER: Sending emails'
  );

  await mailer.message.sendMessage(actor, WELCOME_EMAIL);
  await mailer.message.sendMessage(actor, CONFIRM_EMAIL);

  const response: ApiResponse = {
    data: { id: actor.uuid, type: resourceTypes.ACTOR },
  };

  res.json(response);
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
const confirmActor = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
  const { db } = context;
  const cookies = new Cookies(context.req.headers.cookie);
  const token = cookies.get('actor');
  const decoded: any = jwt.decode(token);

  const actorAccount = await db.findOne(ActorAccount, {
    actor_id: decoded.actorId,
    confirmed_code: args.input.code,
  });

  if (!actorAccount) {
    throw new InternalError('CODE_NOT_FOUND');
  }

  logger.info('AUTH-RESOLVER: Confirming actor account');
  await db.update(
    ActorAccount,
    { uuid: actorAccount.uuid },
    {
      confirmed: true,
      confirmed_code: null,
      confirmed_expires: null,
    }
  );

  return {
    actorId: actorAccount.actor_id,
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
const loginActor = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
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

  const [tokenHeader, tokenBody, tokenSignature] = token.split('.');
  const rememberMeDate = addDays(
    new Date(),
    config.server.auth.cookieExpiresIn
  );

  // TODO: change to `secure: true` when HTTPS
  context.res.cookie('token-payload', `${tokenHeader}.${tokenBody}`, {
    path: '/',
    secure: false,
    ...(args.input.rememberMe && { expires: rememberMeDate }),
  });

  context.res.cookie('token-signature', tokenSignature, {
    path: '/',
    httpOnly: true,
    secure: false,
    ...(args.input.rememberMe && { expires: rememberMeDate }),
  });

  return {
    actorId: actorAccount.actor_id,
    token,
  };
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
const resetPassword = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
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
    throw new InternalError('ACTOR_NOT_FOUND', { args });
  }

  logger.info("AUTH-RESOLVER: Preparing actor's password for reset");
  await db.update(
    ActorAccount,
    { uuid: actorAccount.uuid },
    {
      reset_password_code: generateCode(),
      reset_password_expires: String(
        addMinutes(new Date(), config.server.auth.codes.expireTime)
      ),
    }
  );

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
const sendAuthEmail = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
  const { db } = context;
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
    CONFIRM_EMAIL,
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
const logoutActor = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
  const { db, res } = context;
  const cookies = new Cookies(context.req.headers.cookie);
  const signature = cookies.get('token-signature');

  logger.info('AUTH-RESOLVER: Logging out actor');
  await db.insert(BlacklistedToken, {
    token: `${args.input.token}.${signature}`,
  });

  res.cookie('token-payload', '', { expires: new Date(0) });
  res.cookie('token-signature', '', { expires: new Date(0) });

  return undefined;
};

/**
 * Checks a actor's access
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
const checkAccess = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
  // Skip authentication if auth is turned off
  if (!config.server.auth.enabled) {
    return true;
  }

  const { db } = context;
  const decoded: any = jwt.decode(context.actor.token);
  const blacklistedToken = await db.findOne(BlacklistedToken, {
    token: context.actor.token,
  });

  if (blacklistedToken) {
    logger.info('AUTH-RESOLVER: Received blacklisted auth token');
    return { actorId: context.actor.actorId, token: null };
  }

  try {
    jwt.verify(context.actor.token, config.server.auth.jwt.secret);
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
        return { token: null };
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

      logger.info(
        { actorId: actorAccount.actor_id },
        'AUTH-RESOLVER: Issuing new auth tokens'
      );

      const [
        tokenHeader = '',
        tokenBody = '',
        tokenSignature = '',
      ] = newToken.split('.');

      // TODO: change to `secure: true` when HTTPS
      context.res.cookie('token-payload', `${tokenHeader}.${tokenBody}`, {
        path: '/',
        secure: false,
      });

      context.res.cookie('token-signature', tokenSignature, {
        path: '/',
        httpOnly: true,
        secure: false,
      });

      return { token: newToken };
    }

    return { token: null };
  }

  return { token: context.actor.token };
};

export {
  checkAccess,
  registerActor,
  confirmActor,
  loginActor,
  resetPassword,
  sendAuthEmail,
  logoutActor,
};
