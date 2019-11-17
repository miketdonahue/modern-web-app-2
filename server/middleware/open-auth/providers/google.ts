import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import uuid from 'uuid/v4';
import { prisma } from '@server/prisma/generated/prisma-client';
import { getManager } from 'typeorm';
import config from '@config';
import generateCode from '@server/modules/code';
import logger from '@server/modules/logger';
import { Actor } from '@server/entities/actor';
import { ActorAccount } from '@server/entities/actor-account';
import { Role, RoleName } from '@server/entities/role';
import { Oauth, ProviderName } from '@server/entities/oauth';
import { transformRoleForToken } from '../../../graphql/auth/utilities';
import { jwtUserFragment, userAccountFragment } from '../fragments';

const oauthConfig = {
  callbackUrl: 'http://localhost:8080/oauth/google/callback',
  successRedirect: '/',
  failureRedirect: '/login',
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
export const authorize = (req, res): any => {
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
export const verify = (): any => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET,
    oauthConfig.callbackUrl
  );

  return async (req, res, next) => {
    const db = getManager();
    const { code, state } = req.query;
    const verifiedState = jwt.verify(state, config.server.auth.jwt.secret);
    const { tokens } = await oauth2Client.getToken(code);
    const { email } = jwt.decode(tokens.id_token);
    let actor: any = await db.findOne(Actor, { email });

    if (!verifiedState) {
      logger.error(
        { state: verifiedState.state },
        'OPEN-AUTH-MIDDLEWARE: Could not verify oauth state session value'
      );

      return res.redirect(302, oauthConfig.failureRedirect);
    }

    if (!actor) {
      const role: any = await db.findOne(Role, { name: RoleName.ACTOR });

      logger.info(
        { provider: 'google', method: 'verify' },
        'OPEN-AUTH-MIDDLEWARE: Creating user'
      );

      const insertedActor = await db.insert(Actor, {
        role_id: role.uuid,
        email,
      });

      const [actorData] = insertedActor.raw;
      actor = actorData;

      await db.insert(ActorAccount, {
        actor_id: actor.uuid,
        confirmed_code: config.server.auth.confirmable ? generateCode() : null,
      });
    }

    const refreshToken: any = tokens.refresh_token;
    const expiresAt: any = tokens.expiry_date;

    try {
      const existingOauth = await db.findOne(Oauth, {
        actor_id: actor.uuid,
        provider: ProviderName.GOOGLE,
      });

      if (existingOauth) {
        logger.info(
          { id: existingOauth.uuid, provider: 'google', method: 'verify' },
          'OPEN-AUTH-MIDDLEWARE: Updating existing oauth record'
        );

        await db.update(
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

        await db.insert(Oauth, {
          actor_id: actor.uuid,
          provider: ProviderName.GOOGLE,
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

    const role = await db.findOne(Role, { uuid: actor.role_id });
    req.actor = { uuid: actor.uuid, role: transformRoleForToken(role) };
    return next();
  };
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
export const authenticate = async (req, res): Promise<any> => {
  const db = getManager();
  const { actor } = req;

  try {
    await db.update(
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
    { actorId: actor.uuid, role: actor.role },
    config.server.auth.jwt.secret,
    { expiresIn: config.server.auth.jwt.expiresIn }
  );

  logger.info(
    { provider: 'google', method: 'authenticate' },
    'OPEN-AUTH-MIDDLEWARE: Setting jwt cookie and redirecting'
  );

  const dsToken = jwt.sign({ hash: uuid() }, config.server.auth.jwt.dsSecret, {
    expiresIn: config.server.auth.jwt.expiresIn,
  });

  // TODO: change to `secure: true` when HTTPS
  res.cookie('token', token, { path: '/', secure: false });
  res.cookie('ds_token', dsToken, {
    path: '/',
    httpOnly: true,
    secure: false,
  });

  return res.redirect(302, oauthConfig.successRedirect);
};
