import { isAuthenticated } from '@server/modules/access-rules';

export default {
  Mutation: {
    '*': isAuthenticated,
  },
  Actor: {
    '*': isAuthenticated,
  },
  ActorAccount: {
    '*': isAuthenticated,
  },
};
