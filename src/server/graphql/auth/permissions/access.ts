import { allow } from 'graphql-shield';
import {
  accountUnlocked,
  resetPasswordCodeNotExpired,
  lockedCodeNotExpired,
} from './resolvers';

export default {
  Query: {
    getActorSecurityQuestionAnswers: allow,
    validateAccess: allow,
  },
  Mutation: {
    registerActor: allow,
    confirmActor: allow,
    loginActor: accountUnlocked,
    setActorSecurityQuestionAnswers: allow,
    verifyActorSecurityQuestionAnswers: accountUnlocked,
    resetPassword: allow,
    changePassword: resetPasswordCodeNotExpired,
    unlockAccount: lockedCodeNotExpired,
    sendAuthEmail: allow,
    logoutActor: allow,
  },
  TokenPayload: {
    '*': allow,
  },
  ActorPayload: {
    '*': allow,
  },
};
