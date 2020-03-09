import normalizers from './normalizers';

/**
 * Normalizes errors based on the incoming source
 *
 * @param error - GraphQL Error object from Apollo Server
 * @returns A normalizing function
 */
const normalizeError = (error: any): any => {
  let { source } = error.extensions.exception;

  // Some errors are not interceptable; Set a source here from some identifying property
  if (error.extensions.exception.name === 'ValidationError') {
    source = 'ValidationError';
  }

  switch (source) {
    case 'JsonWebToken':
      return normalizers.jwt(error);
    case 'Mailgun':
      return normalizers.mailgun(error);
    case 'Stripe':
      return normalizers.stripe(error);
    case 'ValidationError':
      return normalizers.validation(error);
    case 'InternalError':
      return {
        code: error.extensions.code,
        level: error.extensions.exception.level,
      };
    default:
      return { code: error.extensions.code, level: 'error' };
  }
};

export { normalizeError };
