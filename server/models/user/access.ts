import { isAuthenticated } from '@server/modules/access-rules';

export default {
  Mutation: {
    '*': isAuthenticated,
  },
  User: {
    '*': isAuthenticated,
  },
  UserAccount: {
    '*': isAuthenticated,
  },
};
