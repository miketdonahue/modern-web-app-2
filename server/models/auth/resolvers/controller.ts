import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import addHours from 'date-fns/add_hours';
import uuid from 'uuid/v4';
import config from '@config';
import generateCode from '@server/modules/code';
import { InternalError } from '@server/modules/errors';
import logger from '@server/modules/logger';
import mailer, {
  WELCOME_EMAIL,
  CONFIRMATION_EMAIL,
  UNLOCK_ACCOUNT_EMAIL,
} from '@server/modules/mailer';
import * as fragments from '../fragments';

/**
 * Registers a new user
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns token
 */
const registerUser = async (parent, args, context, info): Promise<any> => {
  const role = await context.prisma.role({ name: 'USER' });

  logger.info('AUTH-RESOLVER: Hashing password');
  const password = await argon2.hash(args.input.password, {
    timeCost: 2000,
    memoryCost: 500,
  });

  logger.info('AUTH-RESOLVER: Creating user');
  const user = await context.prisma
    .createUser({
      role: { connect: { id: role.id } },
      firstName: args.input.firstName,
      lastName: args.input.lastName,
      email: args.input.email,
      password,
      userAccount: {
        create: config.server.auth.confirmable
          ? {
              confirmedCode: generateCode(),
            }
          : {
              lastVisit: new Date(),
              ip: context.req.ip,
              loginAttempts: 0,
              securityQuestionAttempts: 0,
            },
      },
    })
    .$fragment(fragments.registerUserFragment);

  logger.info('AUTH-RESOLVER: Signing token');
  const token = jwt.sign(
    { cuid: user.id, role: user.role.name },
    config.server.auth.jwt.secret,
    { expiresIn: config.server.auth.jwt.expiresIn }
  );

  const emailType = config.server.auth.confirmable
    ? CONFIRMATION_EMAIL
    : WELCOME_EMAIL;

  logger.info({ emailType }, 'AUTH-RESOLVER: Sending email');
  await mailer.send(user, emailType);

  return {
    token,
  };
};

/**
 * Confirms a new user's account
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const confirmUser = async (parent, args, context, info): Promise<any> => {
  logger.info('AUTH-RESOLVER: Confirming account');
  const user = await context.prisma
    .updateUserAccount({
      data: {
        confirmed: true,
        confirmedCode: null,
      },
      where: {
        confirmedCode: args.input.code,
      },
    })
    .user();

  logger.info('AUTH-RESOLVER: Sending welcome email');
  await mailer.send(user, WELCOME_EMAIL);

  return null;
};

/**
 * Logs in a user
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns token
 */
const loginUser = async (parent, args, context, info): Promise<any> => {
  const user = await context.prisma
    .user({ email: args.input.email })
    .$fragment(fragments.loginUserFragment);

  if (!user) {
    throw new InternalError('INVALID_CREDENTIALS');
  }

  // Transform role data
  user.role.permissions = user.role.permissions.map(role => role.key);
  user.role.prohibitedRoutes = user.role.prohibitedRoutes.paths;

  const passwordMatch = await argon2.verify(user.password, args.input.password);
  const refreshToken = jwt.sign(
    { hash: uuid() },
    config.server.auth.jwt.refreshSecret,
    {
      expiresIn: config.server.auth.jwt.refreshExpiresIn,
    }
  );

  await context.prisma.updateUserAccount({
    data: !passwordMatch
      ? {
          loginAttempts: user.userAccount.loginAttempts + 1,
          locked:
            user.userAccount.loginAttempts >=
            config.server.auth.lockable.maxAttempts,
          lockedCode: user.userAccount.locked && generateCode(),
          lockedExpires:
            user.userAccount.locked &&
            String(
              addHours(new Date(), config.server.auth.codes.expireTime.locked)
            ),
        }
      : {
          lastVisit: new Date(),
          ip: context.req.ip,
          loginAttempts: 0,
          securityQuestionAttempts: 0,
          refreshToken,
        },
    where: {
      id: user.userAccount.id,
    },
  });

  if (!passwordMatch) {
    throw new InternalError('INVALID_CREDENTIALS');
  }

  logger.info('AUTH-RESOLVER: Signing auth tokens');
  const token = jwt.sign(
    { cuid: user.id, role: user.role },
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
    token,
  };
};

/**
 * Sets a user's security question answers
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const setUserSecurityQuestionAnswers = async (
  parent,
  args,
  context,
  info
): Promise<any> => {
  const queue: any = [];
  const userAccount = await context.prisma
    .user({ id: args.input.userId })
    .userAccount()
    .$fragment(`{ id }`);

  if (!userAccount) {
    throw new InternalError('INVALID_USER_INPUT', { args });
  }

  logger.info("AUTH-RESOLVER: Setting user's security questions");
  for (const item of args.input.answers) {
    queue.push(
      context.prisma.createSecurityQuestionAnswer({
        userAccount: { connect: { id: userAccount.id } },
        userSecurityQuestion: { connect: { shortName: item.shortName } },
        answer: item.answer,
      })
    );
  }

  await Promise.all(queue);
  return null;
};

/**
 * Retrieve a user's security question answers
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns An array of answer objects
 */
const getUserSecurityQuestionAnswers = async (
  parent,
  args,
  context,
  info
): Promise<any> => {
  logger.info("AUTH-RESOLVER: Retrieving user's security question answers");

  const answers = await context.prisma
    .user({ id: args.input.userId })
    .userAccount()
    .securityQuestions()
    .$fragment(fragments.userSecurityQuestionAnswersFragment);

  if (!answers) {
    throw new InternalError('INVALID_USER_INPUT', { args });
  }

  return answers;
};

/**
 * Verify a user's security question answers
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const verifyUserSecurityQuestionAnswers = async (
  parent,
  args,
  context,
  info
): Promise<any> => {
  const shortNamesIn: any = [];
  const answersIn: any = [];
  const user = await context.prisma
    .user({ email: args.input.email })
    .$fragment(fragments.verifyUserSecurityQuestionAnswersFragment);

  if (!user) {
    throw new InternalError('INVALID_USER_INPUT', { args });
  }

  args.input.answers.forEach(item => {
    shortNamesIn.push(item.shortName);
    answersIn.push(item.answer);
  });

  logger.info("AUTH-RESOLVER: Verifying user's security answers");
  const answers = await context.prisma
    .user({ email: user.email })
    .userAccount()
    .securityQuestions({
      where: {
        AND: [
          { userSecurityQuestion: { shortName_in: shortNamesIn } },
          { answer_in: answersIn },
        ],
      },
    });

  if (config.server.auth.securityQuestions.number !== answers.length) {
    await context.prisma.updateUserAccount({
      data: {
        securityQuestionAttempts: user.userAccount.securityQuestionAttempts + 1,
        locked:
          user.userAccount.securityQuestionAttempts >=
          config.server.auth.lockable.maxAttempts,
        lockedCode: generateCode(),
        lockedExpires: String(
          addHours(new Date(), config.server.auth.codes.expireTime.locked)
        ),
      },
      where: {
        id: user.userAccount.id,
      },
    });

    throw new InternalError('INVALID_SECURITY_QUESTIONS');
  }

  return null;
};

/**
 * Generate a reset token so a user can reset their password
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const resetPassword = async (parent, args, context, info): Promise<any> => {
  const userAccount = await context.prisma
    .user({ email: args.input.email })
    .userAccount()
    .$fragment(`{ id }`);

  if (!userAccount) {
    throw new InternalError('INVALID_USER_INPUT', { args });
  }

  logger.info("AUTH-RESOLVER: Preparing user's password for reset");
  await context.prisma.updateUserAccount({
    data: {
      resetPasswordCode: generateCode(),
      resetPasswordExpires: String(
        addHours(new Date(), config.server.auth.codes.expireTime.passwordReset)
      ),
    },
    where: {
      id: userAccount.id,
    },
  });

  return null;
};

/**
 * Change password
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const changePassword = async (parent, args, context, info): Promise<any> => {
  logger.info("AUTH-RESOLVER: Changing user's password");
  const password = await argon2.hash(args.input.password, {
    timeCost: 2000,
    memoryCost: 500,
  });

  const userAccount = await context.prisma
    .updateUserAccount({
      data: {
        resetPasswordCode: null,
        resetPasswordExpires: null,
      },
      where: {
        resetPasswordCode: args.input.code,
      },
    })
    .$fragment(`{ user { id } }`);

  await context.prisma.updateUser({
    data: { password },
    where: { id: userAccount.user.id },
  });

  return null;
};

/**
 * Unlock account
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const unlockAccount = async (parent, args, context, info): Promise<any> => {
  logger.info('AUTH-RESOLVER: Unlocking account');
  await context.prisma.updateUserAccount({
    data: {
      locked: false,
      lockedCode: null,
      lockedExpires: null,
    },
    where: {
      lockedCode: args.input.code,
    },
  });

  return null;
};

/**
 * Send an authentication-related email
 *
 * @remarks
 * This is used to resend auth emails
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const sendAuthEmail = async (parent, args, context, info): Promise<any> => {
  const user = await context.prisma.user({ email: args.input.email });
  const emailType = {
    CONFIRMATION_EMAIL,
    UNLOCK_ACCOUNT_EMAIL,
  };

  logger.info('AUTH-RESOLVER: Sending email to user');
  await mailer.send(user, emailType[args.input.type]);

  return null;
};

/**
 * Logout a user
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const logoutUser = async (parent, args, context, info): Promise<any> => {
  logger.info('AUTH-RESOLVER: Logging out user');
  await context.prisma.createBlacklistedTokens({
    token: args.input.token,
  });

  return null;
};

/**
 * Checks if a user is authenticated
 *
 * @remarks
 * Will issue a new token based on a valid refresh token
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns boolean
 */
const isAuthenticated = async (parent, args, context, info): Promise<any> => {
  // Skip authentication if auth is turned off
  if (!config.server.auth.enabled) {
    return true;
  }

  const decoded = jwt.decode(context.user.token);
  const blacklistedToken = await context.prisma.blacklistedTokens({
    token: context.user.token,
  });

  if (blacklistedToken) {
    logger.info('AUTH-RESOLVER: Received blacklisted auth token');
    return false;
  }

  try {
    jwt.verify(context.user.token, config.server.auth.jwt.secret);
    jwt.verify(context.req.cookies.ds_token, config.server.auth.jwt.dsSecret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      logger.info('AUTH-RESOLVER: Auth token has expired');

      const user = await context.prisma
        .user({ id: decoded.cuid })
        .$fragment(fragments.isAuthenticatedFragment);

      if (!user) {
        throw new InternalError('USER_NOT_FOUND');
      }

      try {
        await jwt.verify(
          user.userAccount.refreshToken,
          config.server.auth.jwt.refreshSecret
        );
      } catch (error) {
        return false;
      }

      logger.info(
        { userId: user.id },
        'AUTH-RESOLVER: Found valid refresh token'
      );

      const newToken = jwt.sign(
        { cuid: user.id, role: user.role.name },
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
        { userId: user.id },
        'AUTH-RESOLVER: Issuing new auth tokens'
      );

      context.res.cookie('token', newToken, { path: '/', secure: false });
      context.res.cookie('ds_token', newDsToken, {
        path: '/',
        httpOnly: true,
        secure: false,
      });

      return true;
    }

    return false;
  }

  return true;
};

/**
 * Checks if an access token is valid
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns boolean
 */
const isValidToken = async (parent, args, context, info): Promise<any> => {
  return jwt.verify(
    context.user.token,
    config.server.auth.jwt.secret,
    (err, decoded) => {
      if (err) {
        return {
          token: null,
        };
      }

      return {
        token: context.user.token,
      };
    }
  );
};

export default {
  Query: {
    getUserSecurityQuestionAnswers,
    isAuthenticated,
    isValidToken,
  },
  Mutation: {
    registerUser,
    confirmUser,
    loginUser,
    setUserSecurityQuestionAnswers,
    verifyUserSecurityQuestionAnswers,
    resetPassword,
    changePassword,
    unlockAccount,
    sendAuthEmail,
    logoutUser,
  },
};
