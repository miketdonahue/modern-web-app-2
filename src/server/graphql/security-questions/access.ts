import { allow } from 'graphql-shield';

export default {
  Query: {
    getSecurityQuestions: allow,
  },
  SecurityQuestion: {
    '*': allow,
  },
  SecurityQuestionAnswer: {
    '*': allow,
  },
};
