export default {
  UNAUTHENTICATED: {
    message: 'Unauthenticated',
    code: 'UNAUTHENTICATED',
    meta: { level: 'warn' },
  },
  UNAUTHORIZED: {
    message: 'Unauthorized',
    code: 'UNAUTHORIZED',
    meta: { level: 'warn' },
  },
  INVALID_CREDENTIALS: {
    message: 'Credentials are not valid',
    code: 'INVALID_CREDENTIALS',
    meta: { level: 'warn' },
  },
  EMAIL_FAILURE: {
    message: 'Email was not sent',
    code: 'EMAIL_FAILURE',
    meta: { level: 'error' },
  },
  ACTOR_NOT_FOUND: {
    message: 'Actor was not found',
    code: 'ACTOR_NOT_FOUND',
    meta: { level: 'warn' },
  },
  ACCOUNT_LOCKED: {
    message: 'Actor account is locked',
    code: 'ACCOUNT_LOCKED',
    meta: { level: 'warn' },
  },
  CONFIRMED_CODE_EXPIRED: {
    message: 'Confirmation code has expired',
    code: 'CONFIRMED_CODE_EXPIRED',
    meta: { level: 'warn' },
  },
  RESET_PASSWORD_CODE_EXPIRED: {
    message: 'Reset password code has expired',
    code: 'RESET_PASSWORD_CODE_EXPIRED',
    meta: { level: 'warn' },
  },
  LOCKED_CODE_EXPIRED: {
    message: 'Account locked code has expired',
    code: 'LOCKED_CODE_EXPIRED',
    meta: { level: 'warn' },
  },
  CODE_NOT_FOUND: {
    message: 'Verification code was not found',
    code: 'CODE_NOT_FOUND',
    meta: { level: 'warn' },
  },
  INVALID_SECURITY_QUESTIONS: {
    message: 'Invalid security question answer',
    code: 'INVALID_SECURITY_QUESTIONS',
    meta: { level: 'warn' },
  },
  CUSTOMER_NOT_FOUND: {
    message: 'Customer was not found',
    code: 'CUSTOMER_NOT_FOUND',
    meta: { level: 'warn' },
  },
};
