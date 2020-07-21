import { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { addMinutes, addDays, compareAsc } from 'date-fns';
import { v4 as uuid } from 'uuid';
import Cookies from 'universal-cookie';
import { getManager } from '@server/modules/db-manager';
import generateCode from '@server/modules/code';
import { logger } from '@server/modules/logger';
import {
  resourceTypes,
  ApiResponseWithData,
  ApiResponseWithError,
} from '@modules/api-response';
import { errorTypes } from '@server/modules/errors';
import { Actor } from '@server/entities/actor';
import { ActorAccount } from '@server/entities/actor-account';
import { Role, RoleName } from '@server/entities/role';
import { BlacklistedToken } from '@server/entities/blacklisted-token';
import { sendEmail } from '@server/modules/mailer';
import * as emails from '@server/modules/mailer/emails';
import { config } from '@config';
import { transformRoleForToken } from '@server/modules/utilities';

/**
 * Registers a new actor
 */
const registerActor = async (req: Request, res: Response) => {
  const db = getManager();

  const foundActor = await db.findOne(Actor, { email: req.body.email });

  if (foundActor) {
    const errorResponse: ApiResponseWithError = {
      error: [
        {
          status: '400',
          code: errorTypes.ACCOUNT_ALREADY_EXISTS.code,
          detail: errorTypes.ACCOUNT_ALREADY_EXISTS.detail,
        },
      ],
    };

    logger.error(
      'AUTH-CONTROLLER: An actor with the provided email address already exists'
    );

    return res.status(400).json(errorResponse);
  }

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

  await sendEmail(actor, emails.CONFIRM_EMAIL);
  await sendEmail(actor, emails.WELCOME_EMAIL);

  const response: ApiResponseWithData = {
    data: { id: actor.uuid, type: resourceTypes.ACTOR },
  };

  return res.json(response);
};

/**
 * Confirms a security code
 */
const confirmCode = async (req: Request, res: Response) => {
  const db = getManager();
  const cookies = new Cookies(req.headers.cookie);
  const token = cookies.get('actor');

  const errorResponse: ApiResponseWithError = {
    error: [
      {
        status: '400',
        code: errorTypes.CODE_NOT_FOUND.code,
        detail: errorTypes.CODE_NOT_FOUND.detail,
      },
    ],
  };

  try {
    jwt.verify(token, config.server.auth.jwt.secret);
  } catch (err) {
    logger.warn({ err }, 'AUTH-CONTROLLER: The actor account was not found');
    return res.status(400).json(errorResponse);
  }

  const codeType: any = {
    'confirm-email': {
      type: 'confirmed',
      email: emails.CONFIRM_EMAIL,
    },
    'unlock-account': { type: 'locked', email: emails.UNLOCK_ACCOUNT_EMAIL },
  };

  const decoded: any = jwt.decode(token) || { actor_id: null };
  const actor = await db.findOne(Actor, { uuid: decoded.actor_id });
  const actorAccount: any = await db.findOne(ActorAccount, {
    actor_id: decoded.actor_id,
    [`${codeType[req.body.type].type}_code`]: req.body.code,
  });

  if (!actorAccount) {
    logger.warn('AUTH-CONTROLLER: The actor account was not found');
    return res.status(400).json(errorResponse);
  }

  if (
    !actorAccount[`${codeType[req.body.type].type}_expires`] ||
    compareAsc(
      actorAccount[`${codeType[req.body.type].type}_expires`],
      new Date()
    ) === -1
  ) {
    logger.info('AUTH-CONTROLLER: Resetting confirmation code');
    await db.update(
      ActorAccount,
      { uuid: actorAccount.uuid },
      {
        [`${codeType[req.body.type].type}_code`]: generateCode(),
        [`${codeType[req.body.type].type}_expires`]: String(
          addMinutes(new Date(), config.server.auth.codes.expireTime)
        ),
      }
    );

    logger.info(
      'AUTH-CONTROLLER: Resend confirmation code email due to expired code'
    );

    await sendEmail(actor, codeType[req.body.type].email);

    const errResponse: ApiResponseWithError = {
      error: [
        {
          status: '400',
          code: errorTypes.CODE_EXPIRED.code,
          detail: errorTypes.CODE_EXPIRED.detail,
        },
      ],
    };

    logger.warn(
      {
        code: (actorAccount as any)[`${codeType[req.body.type].type}_code`],
        expires: (actorAccount as any)[
          `${codeType[req.body.type].type}_expires`
        ],
      },
      'AUTH-CONTROLLER: The confirmed code has expired'
    );

    return res.status(400).json(errResponse);
  }

  logger.info('AUTH-CONTROLLER: Confirming actor account');

  await db.update(
    ActorAccount,
    { uuid: actorAccount.uuid },
    {
      ...(req.body.type === 'confirm-email'
        ? { confirmed: true }
        : { locked: false }),
      [`${codeType[req.body.type].type}_code`]: null,
      [`${codeType[req.body.type].type}_expires`]: null,
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
  const actor = await db.findOne(Actor, { email: req.body.email });
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

  const errorResponse: ApiResponseWithError = {
    error: [
      {
        status: '400',
        code: errorTypes.INVALID_CREDENTIALS.code,
        detail: errorTypes.INVALID_CREDENTIALS.detail,
      },
    ],
  };

  if (!actor || !actorAccount) {
    logger.error('AUTH-CONTROLLER: The actor account was not found');
    return res.status(400).json(errorResponse);
  }

  if (!actorAccount.confirmed) {
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

    logger.info('AUTH-CONTROLLER: Resetting confirmation code');
    await db.update(
      ActorAccount,
      { uuid: actorAccount.uuid },
      {
        confirmed_code: generateCode(),
        confirmed_expires: String(
          addMinutes(new Date(), config.server.auth.codes.expireTime)
        ),
      }
    );

    logger.info(
      'AUTH-CONTROLLER: Resend confirmation code email due to account not being confirmed'
    );

    await sendEmail(actor, emails.CONFIRM_EMAIL);

    const errResponse: ApiResponseWithError = {
      error: [
        {
          status: '403',
          code: errorTypes.ACCOUNT_NOT_CONFIRMED.code,
          detail: errorTypes.ACCOUNT_NOT_CONFIRMED.detail,
        },
      ],
    };

    logger.error('AUTH-CONTROLLER: The actor account is not confirmed');
    return res.status(403).json(errResponse);
  }

  if (actorAccount.locked) {
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

    logger.info('AUTH-CONTROLLER: Resetting locked account code');
    await db.update(
      ActorAccount,
      { uuid: actorAccount.uuid },
      {
        locked_code: generateCode(),
        locked_expires: String(
          addMinutes(new Date(), config.server.auth.codes.expireTime)
        ),
      }
    );

    logger.info(
      'AUTH-CONTROLLER: Resend locked account code email due to account being locked'
    );

    await sendEmail(actor, emails.ACCOUNT_LOCKED_EMAIL);

    const errResponse: ApiResponseWithError = {
      error: [
        {
          status: '403',
          code: errorTypes.ACCOUNT_LOCKED.code,
          detail: errorTypes.ACCOUNT_LOCKED.detail,
        },
      ],
    };

    logger.error('AUTH-CONTROLLER: The actor account is locked');
    return res.status(403).json(errResponse);
  }

  const passwordMatch = await argon2.verify(
    actor.password || '',
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
    { actor_id: actor.uuid, role: transformRoleForToken(role) },
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
      id: actor.uuid,
      type: resourceTypes.ACTOR,
      attributes: { token },
    },
  };

  return res.json(response);
};

/**
 * Confirm security code and reset an actor's password
 */
const resetPassword = async (req: Request, res: Response) => {
  const db = getManager();
  const cookies = new Cookies(req.headers.cookie);
  const token = cookies.get('actor');

  const errorResponse: ApiResponseWithError = {
    error: [
      {
        status: '400',
        code: errorTypes.CODE_NOT_FOUND.code,
        detail: errorTypes.CODE_NOT_FOUND.detail,
      },
    ],
  };

  try {
    jwt.verify(token, config.server.auth.jwt.secret);
  } catch (err) {
    logger.warn({ err }, 'AUTH-CONTROLLER: The actor account was not found');
    return res.status(400).json(errorResponse);
  }

  const decoded: any = jwt.decode(token) || { actor_id: null };
  const actor = await db.findOne(Actor, { uuid: decoded.actor_id });
  const actorAccount: any = await db.findOne(ActorAccount, {
    actor_id: decoded.actor_id,
    reset_password_code: req.body.code,
  });

  if (!actor || !actorAccount) {
    logger.warn('AUTH-CONTROLLER: The actor account was not found');
    return res.status(400).json(errorResponse);
  }

  if (
    !actorAccount.reset_password_code ||
    compareAsc(actorAccount.reset_password_expires, new Date()) === -1
  ) {
    logger.info('AUTH-CONTROLLER: Resetting password security code');

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

    logger.info(
      'AUTH-CONTROLLER: Resend password security code email due to expired code'
    );

    await sendEmail(actor, emails.RESET_PASSWORD_EMAIL);

    const errResponse: ApiResponseWithError = {
      error: [
        {
          status: '400',
          code: errorTypes.CODE_EXPIRED.code,
          detail: errorTypes.CODE_EXPIRED.detail,
        },
      ],
    };

    logger.warn(
      {
        code: actorAccount.reset_password_code,
        expires: actorAccount.reset_password_expires,
      },
      'AUTH-CONTROLLER: The reset password code has expired'
    );

    return res.status(400).json(errResponse);
  }

  await db.update(
    ActorAccount,
    { uuid: actorAccount.uuid },
    {
      reset_password_code: null,
      reset_password_expires: null,
    }
  );

  logger.info("AUTH-CONTROLLER: Resetting the actor's password");
  const password = await argon2.hash(req.body.password, {
    timeCost: 2000,
    memoryCost: 500,
  });

  actor.password = password;
  await db.save(actor);

  // Remove 'actor' cookie
  res.cookie('actor', '', { expires: new Date(0) });

  const response: ApiResponseWithData = {
    data: { id: actorAccount.actor_id, type: resourceTypes.ACTOR },
  };

  return res.json(response);
};

/**
 * Regenerate a code and send a corresponding email
 */
const sendCode = async (req: Request, res: Response) => {
  const db = getManager();
  const [actorAccount] = await db.query(
    `
    SELECT
      actor_account.confirmed_code,
      actor_account.locked_code,
      actor_account.reset_password_code,
      actor_account.uuid
    FROM
      actor_account
      INNER JOIN actor ON actor_account.actor_id = actor.uuid
    WHERE
      actor.email = $1
  `,
    [req.body.email]
  );

  if (!actorAccount) {
    logger.warn('AUTH-CONTROLLER: The actor account was not found');
    return res.end();
  }

  const codeType: any = {
    'confirm-email': {
      type: 'confirmed',
      email: emails.CONFIRM_EMAIL,
    },
    'forgot-password': {
      type: 'reset_password',
      email: emails.RESET_PASSWORD_EMAIL,
    },
    'unlock-account': { type: 'locked', email: emails.UNLOCK_ACCOUNT_EMAIL },
  };

  logger.info({ type: req.body.type }, 'AUTH-CONTROLLER: Resetting code');

  await db.update(
    ActorAccount,
    { uuid: actorAccount.uuid },
    {
      [`${codeType[req.body.type].type}_code`]: generateCode(),
      [`${codeType[req.body.type].type}_expires`]: String(
        addMinutes(new Date(), config.server.auth.codes.expireTime)
      ),
    }
  );

  const [updatedActor] = await db.query(
    `
    SELECT
      actor_account.confirmed_code,
      actor_account.locked_code,
      actor_account.reset_password_code,
      actor.uuid,
      actor.email,
      actor.first_name
    FROM
      actor_account
      INNER JOIN actor ON actor_account.actor_id = actor.uuid
    WHERE
      actor_account.uuid = $1
  `,
    [actorAccount.uuid]
  );

  logger.info(
    { type: req.body.type },
    'AUTH-CONTROLLER: Resending code in email to actor'
  );

  await sendEmail(updatedActor, codeType[req.body.type].email);

  logger.info('AUTH-CONTROLLER: Signing actor id token');
  const actorIdToken = jwt.sign(
    { actor_id: updatedActor.uuid },
    config.server.auth.jwt.secret
  );

  // TODO: change to `secure: true` when HTTPS
  res.cookie('actor', actorIdToken, {
    path: '/',
    secure: false,
  });

  const response: ApiResponseWithData = {
    data: {
      id: updatedActor.uuid,
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

export {
  registerActor,
  confirmCode,
  loginActor,
  resetPassword,
  sendCode,
  logoutActor,
};