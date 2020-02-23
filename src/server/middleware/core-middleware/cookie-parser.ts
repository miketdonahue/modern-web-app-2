import cookieParserMiddleware from 'cookie-parser';

/**
 * Cookie Parser Middleware
 *
 * @remarks
 *
 * Parses cookies and populates req.cookies with them. It will not parse signed cookies.
 *
 * https://github.com/expressjs/cookie-parser
 */
export const cookieParser = {
  name: 'cookie-parser',
  function: cookieParserMiddleware(),
};
