import { isAuthenticated } from '@server/modules/access-rules';

export default {
  Role: {
    '*': isAuthenticated,
  },
};
