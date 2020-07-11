import { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { addMinutes, addDays } from 'date-fns';
import { v4 as uuid } from 'uuid';
import Cookies from 'universal-cookie';
import { getManager } from '@server/modules/db-manager';
import generateCode from '@server/modules/code';
import { logger } from '@server/modules/logger';
import {
  resourceTypes,
  ApiResponseWithData,
  ApiResponseWithError,
} from '@server/modules/api-response';
import { errorTypes, InternalError } from '@server/modules/errors';
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

  logger.info('AUTH-CONTROLLER: Hashing password');
  const password = await argon2.hash(req.body.password, {
    timeCost: 2000,
    memoryCost: 500,
  });

  const actorAccount = await db.transaction(
    async (transactionalEntityManager: any) => {
      logger.info('AUTH-CONTROLLER: Creating actor');
      const createdActor = await transactionalEntityManager.create(Actor, {
        role_id: role?.uuid,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        password,
      });

      await transactionalEntityManager.save(createdActor);

      logger.info('AUTH-CONTROLLER: Creating actor account');
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

  logger.info('AUTH-CONTROLLER: Signing actor id token');
  const actorIdToken = jwt.sign(
    { actor_id: actor.uuid },
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
    'AUTH-CONTROLLER: Sending emails'
  );

  await mailer.message.sendMessage(actor, WELCOME_EMAIL);
  await mailer.message.sendMessage(actor, CONFIRM_EMAIL);

  const response: ApiResponseWithData = {
    data: { id: actor.uuid, type: resourceTypes.ACTOR },
  };

  return res.json(response);
};

/**
 * Confirms a new actor's account
 */
const confirmActor = async (req: Request, res: Response) => {
  const db = getManager();
  const cookies = new Cookies(req.headers.cookie);
  const token = cookies.get('actor');
  const decoded: any = jwt.decode(token);

  const actorAccount = await db.findOne(ActorAccount, {
    actor_id: decoded.actor_id,
    confirmed_code: req.body.code,
  });

  if (!actorAccount) {
    const errorResponse: ApiResponseWithError = {
      error: [
        {
          status: '400',
          code: errorTypes.CODE_NOT_FOUND.code,
          detail: errorTypes.CODE_NOT_FOUND.detail,
        },
      ],
    };

    logger.warn('AUTH-CONTROLLER: The actor account was not found');
    return res.status(400).json(errorResponse);
  }

  logger.info('AUTH-CONTROLLER: Confirming actor account');
  await db.update(
    ActorAccount,
    { uuid: actorAccount.uuid },
    {
      confirmed: true,
      confirmed_code: null,
      confirmed_expires: null,
    }
  );

  // Remove 'actor' cookie
  res.cookie('actor', '', { expires: new Date(0) });

  const response: ApiResponseWithData = {
    data: { id: actorAccount.actor_id, type: resourceTypes.ACTOR },
  };

  return res.json(response);
};

/**
 * Logs in an actor
 */
const loginActor = async (req: Request, res: Response) => {
  const db = getManager();

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
    [req.body.email]
  );

  const errorResponse: ApiResponseWithError = {
    error: [
      {
        status: '400',
        code: errorTypes.INVALID_CREDENTIALS.code,
        detail: errorTypes.INVALID_CREDENTIALS.detail,
      },
    ],
  };

  if (!actorAccount) {
    logger.error('AUTH-CONTROLLER: The actor account was not found');
    return res.status(400).json(errorResponse);
  }

  const passwordMatch = await argon2.verify(
    actorAccount.password,
    req.body.password
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
          ip: req.ip,
          login_attempts: 0,
          refresh_token: refreshToken,
        }
  );

  if (!passwordMatch) {
    logger.error(
      'AUTH-CONTROLLER: The actor password did not match our records'
    );

    return res.status(400).json(errorResponse);
  }

  logger.info('AUTH-CONTROLLER: Signing auth tokens');
  const token = jwt.sign(
    { actor_id: actorAccount.actor_id, role: transformRoleForToken(role) },
    config.server.auth.jwt.secret,
    { expiresIn: config.server.auth.jwt.expiresIn }
  );

  const [tokenHeader, tokenBody, tokenSignature] = token.split('.');
  const rememberMeDate = addDays(
    new Date(),
    config.server.auth.cookieExpiresIn
  );

  // TODO: change to `secure: true` when HTTPS
  res.cookie('token-payload', `${tokenHeader}.${tokenBody}`, {
    path: '/',
    secure: false,
    ...(req.body.rememberMe && { expires: rememberMeDate }),
  });

  res.cookie('token-signature', tokenSignature, {
    path: '/',
    httpOnly: true,
    secure: false,
    ...(req.body.rememberMe && { expires: rememberMeDate }),
  });

  const response: ApiResponseWithData = {
    data: {
      id: actorAccount.actor_id,
      type: resourceTypes.ACTOR,
      attributes: { token },
    },
  };

  return res.json(response);
};

/**
 * Generate a reset token so a actor can reset their password
 */
const forgotPassword = async (req: Request, res: Response) => {
  const db = getManager();

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
    [req.body.email]
  );

  if (!actorAccount) {
    logger.error('AUTH-CONTROLLER: The actor account was not found');

    return res.end();
  }

  logger.info("AUTH-CONTROLLER: Preparing actor's password for reset");

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

  const response: ApiResponseWithData = {
    data: {
      id: actorAccount.actor_id,
      type: resourceTypes.ACTOR,
    },
  };

  return res.json(response);
};

/**
 * Send an authentication-related email
 *
 * @description Used when needing to resend an auth related email
 */
const sendAuthEmail = async (req: Request, res: Response) => {
  const db = getManager();
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
    [req.body.email]
  );

  const emailType = {
    CONFIRM_EMAIL,
    UNLOCK_ACCOUNT_EMAIL,
  };

  logger.info(
    { type: req.body.type },
    'AUTH-CONTROLLER: Sending email to actor'
  );

  await mailer.message.sendMessage(actor, (emailType as any)[req.body.type]);

  const response: ApiResponseWithData = {
    data: {
      id: actor.uuid,
      type: resourceTypes.ACTOR,
    },
  };

  return res.json(response);
};

/**
 * Logout an actor
 */
const logoutActor = async (req: Request, res: Response) => {
  const db = getManager();
  const cookies = new Cookies(req.headers.cookie);
  const signature = cookies.get('token-signature');

  logger.info('AUTH-CONTROLLER: Logging out actor');
  await db.insert(BlacklistedToken, {
    token: `${req.body.token}.${signature}`,
  });

  res.cookie('token-payload', '', { expires: new Date(0) });
  res.cookie('token-signature', '', { expires: new Date(0) });

  return res.end();
};

/**
 * Checks a actor's access
 */
const checkAccess = async (req: Request, res: Response) => {
  // Skip authentication if auth is turned off
  if (!config.server.auth.enabled) {
    return true;
  }

  const db = getManager();
  const decoded: any = jwt.decode(context.actor.token);
  const blacklistedToken = await db.findOne(BlacklistedToken, {
    token: context.actor.token,
  });

  if (blacklistedToken) {
    logger.info('AUTH-CONTROLLER: Received blacklisted auth token');
    return { actorId: context.actor.actorId, token: null };
  }

  try {
    jwt.verify(context.actor.token, config.server.auth.jwt.secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      logger.info('AUTH-CONTROLLER: Auth token has expired');

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
        'AUTH-CONTROLLER: Found valid refresh token'
      );

      const newToken = jwt.sign(
        { actor_id: actorAccount.actor_id, role: transformRoleForToken(role) },
        config.server.auth.jwt.secret,
        { expiresIn: config.server.auth.jwt.expiresIn }
      );

      logger.info(
        { actorId: actorAccount.actor_id },
        'AUTH-CONTROLLER: Issuing new auth tokens'
      );

      const [
        tokenHeader = '',
        tokenBody = '',
        tokenSignature = '',
      ] = newToken.split('.');

      // TODO: change to `secure: true` when HTTPS
      res.cookie('token-payload', `${tokenHeader}.${tokenBody}`, {
        path: '/',
        secure: false,
      });

      res.cookie('token-signature', tokenSignature, {
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
  forgotPassword,
  sendAuthEmail,
  logoutActor,
};
