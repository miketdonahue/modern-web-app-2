import { allow } from 'graphql-shield';

export default {
  Mutation: {
    createCharge: allow,
  },
};
