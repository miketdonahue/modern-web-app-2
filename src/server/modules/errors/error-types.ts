export const errorTypes = {
  UNAUTHENTICATED: {
    code: 'UNAUTHENTICATED',
    detail: 'You are not authenticated and thus cannot perform this action.',
  },
  ACCOUNT_ALREADY_EXISTS: {
    code: 'ACCOUNT_ALREADY_EXISTS',
    detail:
      'An account with this email address already exists. Try signing in instead.',
  },
  ACCOUNT_NOT_CONFIRMED: {
    code: 'ACCOUNT_NOT_CONFIRMED',
    detail: 'Your account is not confirmed.',
  },
  ACCOUNT_LOCKED: {
    code: 'ACCOUNT_LOCKED',
    detail:
      'Your account has been locked. Please check your email for further instructions.',
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    detail:
      "Oops, you've entered an invalid email and/or password. Please try again.",
  },
  CODE_NOT_FOUND: {
    code: 'CODE_NOT_FOUND',
    detail: 'Your verification code is invalid.',
  },
  CODE_EXPIRED: {
    code: 'CODE_EXPIRED',
    detail:
      "Unfortunately, your code has expired. But, we've just sent a new code to your email address.",
  },
};
