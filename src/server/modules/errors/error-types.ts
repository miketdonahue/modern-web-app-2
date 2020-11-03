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
      'Unfortunately, your code has expired. We have sent a new code to your email.',
  },
  INVALID_CART_ITEMS: {
    code: 'INVALID_CART_ITEMS',
    detail: 'Oops, there is an error with your cart. Please try again later.',
  },
  CART_NOT_FOUND: {
    code: 'CART_NOT_FOUND',
    detail: 'We could not find your shopping cart. Please log out.',
  },
  PRODUCT_NOT_FOUND: {
    code: 'PRODUCT_NOT_FOUND',
    detail: 'Sorry, we could not find the product you are looking for.',
  },
  GENERIC: {
    code: 'GENERIC',
    detail: 'Oops! Something went wrong. Please try again or contact support.',
  },
};
