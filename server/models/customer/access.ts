import { allow } from 'graphql-shield';
import { isAuthenticated } from '@server/modules/access-rules';

export default {
  Mutation: {
    createCustomer: allow,
    updateCustomer: allow,
  },
  Customer: {
    '*': isAuthenticated,
  },
};
