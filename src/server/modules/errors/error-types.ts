export const errorTypes = {
  GENERIC: {
    status: 500,
    code: 'GENERIC',
    detail: 'Oops! Something went wrong. Please try again or contact support.',
  },
  UNAUTHENTICATED: {
    status: 401,
    code: 'UNAUTHENTICATED',
    detail: 'You are not authenticated and thus cannot perform this action.',
  },
  UNAUTHORIZED: {
    status: 403,
    code: 'UNAUTHORIZED',
    detail: 'You are not authorized to view this content.',
  },
  ACCOUNT_ALREADY_EXISTS: {
    status: 400,
    code: 'ACCOUNT_ALREADY_EXISTS',
    detail:
      'An account with this email address already exists. Try signing in instead.',
  },
  ACCOUNT_NOT_CONFIRMED: {
    status: 403,
    code: 'ACCOUNT_NOT_CONFIRMED',
    detail: 'Your account is not confirmed.',
  },
  ACCOUNT_LOCKED: {
    status: 403,
    code: 'ACCOUNT_LOCKED',
    detail:
      'Your account has been locked. Please check your email for further instructions.',
  },
  INVALID_CREDENTIALS: {
    status: 400,
    code: 'INVALID_CREDENTIALS',
    detail:
      "Oops, you've entered an invalid email and/or password. Please try again.",
  },
  CODE_NOT_FOUND: {
    status: 400,
    code: 'CODE_NOT_FOUND',
    detail: 'Your verification code is invalid.',
  },
  CODE_EXPIRED: {
    status: 400,
    code: 'CODE_EXPIRED',
    detail:
      'Unfortunately, your code has expired. We have sent a new code to your email.',
  },
  INVALID_CART_ITEMS: {
    status: 401,
    code: 'INVALID_CART_ITEMS',
    detail: 'Oops, there is an error with your cart. Please try again later.',
  },
  CART_NOT_FOUND: {
    status: 400,
    code: 'CART_NOT_FOUND',
    detail: 'We could not find your shopping cart. Please log out.',
  },
  PRODUCT_NOT_FOUND: {
    status: 400,
    code: 'PRODUCT_NOT_FOUND',
    detail:
      'Sorry, we could not find the product you are looking for. Please contact support.',
  },
  PURCHASE_NOT_FOUND: {
    status: 400,
    code: 'PURCHASE_NOT_FOUND',
    detail:
      'Sorry, we could not find your purchase order. Please contact support.',
  },
  GITHUB_CODE_NOT_FOUND: {
    status: 404,
    code: 'GITHUB_CODE_NOT_FOUND',
    detail: 'We could not display the code sample.',
  },
  GITHUB_FILE_NOT_FOUND: {
    status: 404,
    code: 'GITHUB_FILE_NOT_FOUND',
    detail: 'We could not display the contents of this file.',
  },
};
