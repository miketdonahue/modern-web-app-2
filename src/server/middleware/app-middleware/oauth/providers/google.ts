import { Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { getConnection } from 'typeorm';
import generateCode from '@server/modules/code';
import { logger } from '@server/modules/logger';
import { Actor } from '@server/entities/actor';
import { ActorAccount } from '@server/entities/actor-account';
import { Role, ROLE_NAME } from '@server/entities/role';
import { Oauth, PROVIDER_NAME } from '@server/entities/oauth';
import { config } from '@config';
import { transformRoleForToken } from '@server/modules/utilities';

const isDev = process.env.NODE_ENV !== 'production';
const dbConnectionName = isDev ? 'development' : 'production';

const oauthConfig = {
  callbackUrl: `${config.server.domain}/app/oauth/google/callback`,
  successRedirect: '/app',
  failureRedirect: '/app/login',
};

/**
 * Send user to OAuth provider login page
 *
 * @remarks
 * This is an Express.js route callback function signature.
 *
 * @param req - Express.js request objet
 * @param res - Express.js response object
 * @returns Redirect to provider login
 */
export const authorize = (req: Request, res: Response): any => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET,
    oauthConfig.callbackUrl
  );

  const scopes = ['https://www.googleapis.com/auth/userinfo.email'];
  const state = jwt.sign({ state: uuid() }, config.server.auth.jwt.secret, {
    expiresIn: '1m',
  });

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    state,
    scope: scopes,
  });

  logger.info(
    { provider: 'google', method: 'authorize' },
    'OPEN-AUTH-MIDDLEWARE: Redirecting to provider'
  );

  return res.redirect(302, url);
};

/**
 * Verify an OAuth user coming back from the provider's login flow
 *
 * @remarks
 * This function will do the following:
 *    - Verify the state param for CSRF protection
 *    - If not user currently exists in the DB, create one
 *    - Exchange the access code for an access token
 *    - Create an OAuth DB entry
 *    - Attach the user to req.actor and move forward to next middleware in the chain
 *
 * @returns An Express.js middleware closure
 */
export const verify = {
  name: 'oauth-google-verify',
  function: async (req: Request, res: Response, next: NextFunction) => {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_SECRET,
      oauthConfig.callbackUrl
    );

    const db = getConnection(dbConnectionName);
    const { code } = req.query;
    const verifiedState: any = jwt.verify(
      req.query.state as string,
      config.server.auth.jwt.secret
    );
    const { tokens } = await oauth2Client.getToken(code as string);
    const decoded: any = jwt.decode(tokens.id_token as string);
    let actor: any = await db.manager.findOne(Actor, { email: decoded.email });

    if (!verifiedState) {
      logger.error(
        { state: verifiedState.state },
        'OPEN-AUTH-MIDDLEWARE: Could not verify oauth state session value'
      );

      return res.redirect(302, oauthConfig.failureRedirect);
    }

    if (!actor) {
      const role: any = await db.manager.findOne(Role, {
        name: ROLE_NAME.ACTOR,
      });

      logger.info(
        { provider: 'google', method: 'verify' },
        'OPEN-AUTH-MIDDLEWARE: Creating user'
      );

      await db.manager.insert(Actor, {
        role_id: role.uuid,
        email: decoded.email,
      });

      const actorData = await db.manager.findOne(Actor, {
        email: decoded.email,
      });

      actor = actorData;

      await db.manager.insert(ActorAccount, {
        actor_id: actor.uuid,
        confirmed_code: config.server.auth.confirmable ? generateCode() : null,
      });
    }

    const refreshToken: any = tokens.refresh_token;
    const expiresAt: any = tokens.expiry_date;

    try {
      const existingOauth = await db.manager.findOne(Oauth, {
        actor_id: actor.uuid,
        provider: PROVIDER_NAME.GOOGLE,
      });

      if (existingOauth) {
        logger.info(
          { id: existingOauth.uuid, provider: 'google', method: 'verify' },
          'OPEN-AUTH-MIDDLEWARE: Updating existing oauth record'
        );

        await db.manager.update(
          Oauth,
          { uuid: existingOauth.uuid },
          {
            refresh_token: refreshToken,
            expires_at: new Date(expiresAt),
          }
        );
      } else {
        logger.info(
          { provider: 'google', method: 'verify' },
          'OPEN-AUTH-MIDDLEWARE: Creating new oauth record'
        );

        await db.manager.insert(Oauth, {
          actor_id: actor.uuid,
          provider: PROVIDER_NAME.GOOGLE,
          refresh_token: refreshToken,
          expires_at: new Date(expiresAt),
        });
      }
    } catch (err) {
      logger.error(
        { actorId: actor.uuid, err },
        'OPEN-AUTH-MIDDLEWARE: Could not update or add open auth details to database'
      );

      return res.redirect(302, oauthConfig.failureRedirect);
    }

    const role = await db.manager.findOne(Role, { uuid: actor.role_id });
    (req as any).actor = {
      uuid: actor.uuid,
      role: transformRoleForToken(role),
    };

    return next();
  },
};

/**
 * Authenticates a user coming back from a provider flow
 *
 * @remarks
 * This function is called after a user successfully authenticates with an OAuth provider.
 * It will update a few properties on the user account, sign a new token, and set the token cookie
 * This is an Express.js route callback function signature.
 *
 * @param req - Express.js request objet
 * @param res - Express.js response object
 * @returns Redirect to the "success" route, usually the root path
 */
export const authenticate = async (
  req: Request,
  res: Response
): Promise<any> => {
  const db = getConnection(dbConnectionName);
  const { actor } = req as any;

  try {
    await db.manager.update(
      ActorAccount,
      { actor_id: actor.uuid },
      { last_visit: new Date(), ip: req.ip }
    );
  } catch (err) {
    logger.error(
      { actorId: actor.uuid, err },
      'OPEN-AUTH-MIDDLEWARE: Could not update user account database table'
    );

    return res.redirect(302, oauthConfig.failureRedirect);
  }

  logger.info(
    { provider: 'google', method: 'authenticate' },
    'OPEN-AUTH-MIDDLEWARE: Signing token'
  );

  const token = jwt.sign(
    { actor_id: actor.uuid, role: actor.role },
    config.server.auth.jwt.secret,
    { expiresIn: config.server.auth.jwt.expiresIn }
  );

  logger.info(
    { provider: 'google', method: 'authenticate' },
    'OPEN-AUTH-MIDDLEWARE: Setting jwt cookie and redirecting'
  );

  const [tokenHeader = '', tokenBody = '', tokenSignature = ''] = token.split(
    '.'
  );

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

  // Remove 'actor' cookie
  res.cookie('actor', '', { expires: new Date(0) });

  return res.redirect(302, oauthConfig.successRedirect);
};
