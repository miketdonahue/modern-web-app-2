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
  ApiResponseWithData,
  ApiResponseWithError,
} from '@modules/api-response';
import { Token } from '@modules/types/entities';
import { verifyRefreshToken } from '@server/middleware/app-middleware';
import { errorTypes } from '@server/modules/errors';
import { Actor } from '@server/entities/actor';
import { ActorAccount } from '@server/entities/actor-account';
import { Cart } from '@server/entities/cart';
import { CART_STATUS } from '@typings/entities/cart';
import { Role, ROLE_NAME } from '@server/entities/role';
import { BlacklistedToken } from '@server/entities/blacklisted-token';
import { sendEmail } from '@server/modules/mailer';
import * as emails from '@server/modules/mailer/emails';
import { config } from '@config';
import { transformRoleForToken } from '@server/modules/utilities';
import { JwtResponse } from '@typings/jwt';

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

  const role = await db.findOne(Role, { name: ROLE_NAME.ACTOR });

  logger.info('AUTH-CONTROLLER: Hashing password');
  const password = await argon2.hash(req.body.password, {
    timeCost: 2000,
    memoryCost: 500,
  });

  const actorAccount = await db.transaction(async (manager: any) => {
    logger.info('AUTH-CONTROLLER: Creating actor');
    const createdActor = await manager.create(Actor, {
      role_id: role?.id,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      password,
    });

    await manager.save(createdActor);

    logger.info('AUTH-CONTROLLER: Creating actor account');
    const createdActorAccount = await db.create(ActorAccount, {
      actor_id: createdActor.id,
      ...(config.server.auth.confirmable && {
        confirmed_code: generateCode(),
        confirmed_expires: String(
          addMinutes(new Date(), config.server.auth.codes.expireTime)
        ),
      }),
      last_visit: new Date(),
      ip: req.ip,
    });

    await manager.save(createdActorAccount);

    logger.info('AUTH-CONTROLLER: Creating shopping cart for user');
    const createdCart = await db.create(Cart, {
      actor_id: createdActor.id,
      status: CART_STATUS.NEW,
    });

    await manager.save(createdCart);

    return createdActorAccount;
  });

  const [actor] = await db.query(
    `
    SELECT
      actor.*,
      actor_account.confirmed_code
    FROM
      actor
      INNER JOIN actor_account ON actor_account.actor_id = actor.id
    WHERE
      actor.id = $1
  `,
    [actorAccount.actor_id]
  );

  logger.info('AUTH-CONTROLLER: Signing actor id token');
  const actorIdToken = jwt.sign(
    { id: actor.id },
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

  await sendEmail(actor, emails.WELCOME_EMAIL);
  await sendEmail(actor, emails.CONFIRM_EMAIL);

  const response: ApiResponseWithData = {
    data: { attributes: { id: actor.id } },
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
  const actor = await db.findOne(Actor, { id: decoded.actor_id });
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
      { id: actorAccount.id },
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

    const updatedActorAccount = await db.findOne(ActorAccount, {
      id: actorAccount.id,
    });

    await sendEmail(
      { ...actor, ...updatedActorAccount },
      codeType[req.body.type].email
    );

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
    { id: actorAccount.id },
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
    data: { attributes: { id: actorAccount.actor_id } },
  };

  return res.json(response);
};

/**
 * Logs in an actor
 */
const loginActor = async (req: Request, res: Response) => {
  const db = getManager();

  const role = await db.findOne(Role, { name: ROLE_NAME.ACTOR });
  const actor = await db.findOne(Actor, { email: req.body.email });
  const [actorAccount] = await db.query(
    `
    SELECT
      actor_account.*
    FROM
      actor_account
      INNER JOIN actor ON actor_account.actor_id = actor.id
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
    logger.warn('AUTH-CONTROLLER: The actor account was not found');
    return res.status(400).json(errorResponse);
  }

  if (config.server.auth.confirmable && !actorAccount.confirmed) {
    logger.info('AUTH-CONTROLLER: Signing actor id token');
    const actorIdToken = jwt.sign(
      { id: actor.id },
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
      { id: actorAccount.id },
      {
        ...(config.server.auth.confirmable && {
          confirmed_code: generateCode(),
          confirmed_expires: String(
            addMinutes(new Date(), config.server.auth.codes.expireTime)
          ),
        }),
      }
    );

    logger.info(
      'AUTH-CONTROLLER: Resend confirmation code email due to account not being confirmed'
    );

    const updatedActorAccount = await db.findOne(ActorAccount, {
      actor_id: actor.id,
    });

    await sendEmail({ ...actor, ...updatedActorAccount }, emails.CONFIRM_EMAIL);

    const errResponse: ApiResponseWithError = {
      error: [
        {
          status: '403',
          code: errorTypes.ACCOUNT_NOT_CONFIRMED.code,
          detail: errorTypes.ACCOUNT_NOT_CONFIRMED.detail,
        },
      ],
    };

    logger.warn('AUTH-CONTROLLER: The actor account is not confirmed');
    return res.status(403).json(errResponse);
  }

  if (actorAccount.locked) {
    logger.info('AUTH-CONTROLLER: Signing actor id token');
    const actorIdToken = jwt.sign(
      { id: actor.id },
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
      { id: actorAccount.id },
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

    logger.warn('AUTH-CONTROLLER: The actor account is locked');
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
    { id: actorAccount.id },
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
    { id: actor.id, role: transformRoleForToken(role) },
    config.server.auth.jwt.secret,
    { expiresIn: config.server.auth.jwt.expiresIn }
  );

  const [tokenHeader, tokenBody, tokenSignature] = token.split('.');
  const rememberMeDate = addDays(
    new Date(),
    config.server.auth.cookieExpiresIn
  );

  // TODO: change to `secure: true` when HTTPS
  res.cookie(
    config.server.auth.jwt.tokenNames.payload,
    `${tokenHeader}.${tokenBody}`,
    {
      path: '/',
      secure: false,
      ...(req.body.rememberMe && { expires: rememberMeDate }),
    }
  );

  res.cookie(config.server.auth.jwt.tokenNames.signature, tokenSignature, {
    path: '/',
    httpOnly: true,
    secure: false,
    ...(req.body.rememberMe && { expires: rememberMeDate }),
  });

  res.cookie(config.server.auth.jwt.tokenNames.refresh, refreshToken, {
    path: '/',
    httpOnly: true,
    secure: false,
  });

  const response: ApiResponseWithData<Token> = {
    data: {
      attributes: { id: actor.id, token },
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
  const actor = await db.findOne(Actor, { id: decoded.actor_id });
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
      { id: actorAccount.id },
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

    const updatedActorAccount = await db.findOne(ActorAccount, {
      actor_id: actor.id,
    });

    await sendEmail(
      { ...actor, ...updatedActorAccount },
      emails.RESET_PASSWORD_EMAIL
    );

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
    { id: actorAccount.id },
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
    data: { attributes: { id: actorAccount.actor_id } },
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
      actor_account.id
    FROM
      actor_account
      INNER JOIN actor ON actor_account.actor_id = actor.id
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
    { id: actorAccount.id },
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
      actor.id,
      actor.email,
      actor.first_name
    FROM
      actor_account
      INNER JOIN actor ON actor_account.actor_id = actor.id
    WHERE
      actor_account.id = $1
  `,
    [actorAccount.id]
  );

  logger.info(
    { type: req.body.type },
    'AUTH-CONTROLLER: Resending code in email to actor'
  );

  await sendEmail(updatedActor, codeType[req.body.type].email);

  logger.info('AUTH-CONTROLLER: Signing actor id token');
  const actorIdToken = jwt.sign(
    { id: updatedActor.id },
    config.server.auth.jwt.secret
  );

  // TODO: change to `secure: true` when HTTPS
  res.cookie('actor', actorIdToken, {
    path: '/',
    secure: false,
  });

  const response: ApiResponseWithData = {
    data: {
      attributes: { id: updatedActor.id },
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
  const signature = cookies.get(config.server.auth.jwt.tokenNames.signature);

  logger.info('AUTH-CONTROLLER: Logging out actor');
  logger.info('AUTH-CONTROLLER: Blacklisting current auth token');
  await db.insert(BlacklistedToken, {
    token: `${req.body.token}.${signature}`,
  });

  logger.info('AUTH-CONTROLLER: Removing auth tokens from browser cookies');

  res.cookie(config.server.auth.jwt.tokenNames.payload, '', {
    expires: new Date(0),
  });

  res.cookie(config.server.auth.jwt.tokenNames.signature, '', {
    expires: new Date(0),
  });

  res.cookie(config.server.auth.jwt.tokenNames.refresh, '', {
    expires: new Date(0),
  });

  return res.end();
};

/**
 * Checks if a user is authenticated
 *
 * Will only fail when the refresh token has expired a.k.a when the user is fully unauthenticated
 * Bypasses the automatic redirect to the login page on the client so further action can be taken on the client
 */
const isAuthenticated = async (req: Request, res: Response) => {
  const uc = new Cookies(req.headers && req.headers.cookie);
  const uCookies = uc.getAll();

  const newToken = await verifyRefreshToken(
    uCookies[config.server.auth.jwt.tokenNames.refresh]
  );

  if (!newToken) {
    logger.warn(
      'SECURE-PAGE-MIDDLEWARE: Could not get new token with refresh token'
    );

    const errorResponse: ApiResponseWithError = {
      error: [
        {
          status: '401',
          code: errorTypes.UNAUTHENTICATED.code,
          detail: errorTypes.UNAUTHENTICATED.detail,
          meta: {
            bypassFailureRedirect: true,
          },
        },
      ],
    };

    return res.status(401).json(errorResponse);
  }

  // TODO: change to `secure: true` when HTTPS
  res.cookie(
    config.server.auth.jwt.tokenNames.payload,
    `${newToken.header}.${newToken.body}`,
    {
      path: '/',
      secure: false,
    }
  );

  res.cookie(config.server.auth.jwt.tokenNames.signature, newToken.signature, {
    path: '/',
    httpOnly: true,
    secure: false,
  });

  const constructedToken = `${newToken.header}.${newToken.body}.${newToken.signature}`;
  const decoded = jwt.decode(constructedToken) as JwtResponse;

  const response: ApiResponseWithData<Partial<JwtResponse>> = {
    data: {
      attributes: { id: decoded?.id },
    },
  };

  return res.json(response);
};

/**
 * Gets a new authentication token provided a valid refresh token
 */
const getToken = async (req: Request, res: Response) => {
  const uc = new Cookies(req.headers && req.headers.cookie);
  const uCookies = uc.getAll();

  const newToken = await verifyRefreshToken(
    uCookies[config.server.auth.jwt.tokenNames.refresh]
  );

  if (!newToken) {
    logger.warn(
      'SECURE-PAGE-MIDDLEWARE: Could not get new token with refresh token'
    );

    const errorResponse: ApiResponseWithError = {
      error: [
        {
          status: '401',
          code: errorTypes.UNAUTHENTICATED.code,
          detail: errorTypes.UNAUTHENTICATED.detail,
        },
      ],
    };

    return res.status(401).json(errorResponse);
  }

  // TODO: change to `secure: true` when HTTPS
  res.cookie(
    config.server.auth.jwt.tokenNames.payload,
    `${newToken.header}.${newToken.body}`,
    {
      path: '/',
      secure: false,
    }
  );

  res.cookie(config.server.auth.jwt.tokenNames.signature, newToken.signature, {
    path: '/',
    httpOnly: true,
    secure: false,
  });

  return res.end();
};

export {
  registerActor,
  confirmCode,
  loginActor,
  resetPassword,
  sendCode,
  logoutActor,
  isAuthenticated,
  getToken,
};
