import { allow } from 'graphql-shield';
import {
  accountUnlocked,
  resetPasswordCodeNotExpired,
  lockedCodeNotExpired,
} from './resolvers';

export default {
  Query: {
    getUserSecurityQuestionAnswers: allow,
    validateAccess: allow,
  },
  Mutation: {
    registerActor: allow,
    confirmActor: allow,
    loginActor: accountUnlocked,
    setUserSecurityQuestionAnswers: allow,
    verifyUserSecurityQuestionAnswers: accountUnlocked,
    resetPassword: allow,
    changePassword: resetPasswordCodeNotExpired,
    unlockAccount: lockedCodeNotExpired,
    sendAuthEmail: allow,
  },
  TokenPayload: {
    '*': allow,
  },
  ActorPayload: {
    '*': allow,
  },
};
