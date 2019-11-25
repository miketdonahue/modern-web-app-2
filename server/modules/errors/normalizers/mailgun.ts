/**
 * Mailgun error normalizer
 *
 * @param error - GraphQL Error object from Apollo Server
 * @returns A standardized error code and logger level
 */
export default error => {
  const errorInfo = { code: 'MAILGUN', level: 'error' };

  switch (error.extensions.exception.statusCode) {
    case 400:
      errorInfo.code = 'MAILGUN_BAD_REQUEST';
      break;
    case 401:
      errorInfo.code = 'MAILGUN_UNAUTHORIZED';
      break;
    case 402:
      errorInfo.code = 'MAILGUN_REQUEST_FAILED';
      break;
    case 404:
      errorInfo.code = 'MAILGUN_NOT_FOUND';
      break;
    case 413:
      errorInfo.code = 'MAILGUN_ATTACHMENT_SIZE';
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      errorInfo.code = 'MAILGUN_INTERNAL';
      break;
    default:
      break;
  }

  return errorInfo;
};
