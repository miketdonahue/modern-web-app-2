import { inputRule } from 'graphql-shield';
import {
  alpha,
  alphaNumeric,
  code,
  email,
} from '@server/modules/validation-rules';
import { config } from '@config';

const answers = (yup: any): any =>
  yup.array().of(yup.object()).min(config.server.auth.securityQuestions.number);

export default {
  Query: {
    getActorSecurityQuestionAnswers: inputRule()((yup) =>
      yup.object({
        input: yup.object({ actorId: alphaNumeric }),
      })
    ),
  },
  Mutation: {
    registerActor: inputRule()((yup) =>
      yup.object({
        input: yup.object({ firstName: alpha, lastName: alpha, email }),
      })
    ),
    confirmActor: inputRule()((yup) =>
      yup.object({
        input: yup.object({
          code,
        }),
      })
    ),
    loginActor: inputRule()((yup) =>
      yup.object({ input: yup.object({ email }) })
    ),
    setActorSecurityQuestionAnswers: inputRule()((yup) =>
      yup.object({
        input: yup.object({
          email,
          answers: answers(yup),
        }),
      })
    ),
    verifyActorSecurityQuestionAnswers: inputRule()((yup) =>
      yup.object({
        input: yup.object({
          email,
          answers: answers(yup),
        }),
      })
    ),
    resetPassword: inputRule()((yup) =>
      yup.object({ input: yup.object({ email }) })
    ),
    changePassword: inputRule()((yup) =>
      yup.object({
        input: yup.object({
          code,
        }),
      })
    ),
    unlockAccount: inputRule()((yup) =>
      yup.object({
        input: yup.object({
          code,
        }),
      })
    ),
    sendAuthEmail: inputRule()((yup) =>
      yup.object({
        input: yup.object({
          email,
          type: yup.mixed().oneOf(['CONFIRM_EMAIL', 'UNLOCK_ACCOUNT_EMAIL']),
        }),
      })
    ),
  },
};
