import { allow } from 'graphql-shield';
import { isAuthenticated } from '@server/modules/access-rules';

export default {
  Query: {
    getSecurityQuestions: isAuthenticated,
  },
  SecurityQuestion: {
    '*': allow,
  },
  SecurityQuestionAnswer: {
    '*': allow,
  },
};
