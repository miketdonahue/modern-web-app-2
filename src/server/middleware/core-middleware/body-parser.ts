import bodyParserMiddleware from 'body-parser';
import { config } from '@config';

const { urlEncoded, json } = config.server.middleware.bodyParser;

/**
 * Body Parser Middleware
 *
 * @remarks
 *
 * Parses the Node.js body inside of a middleware making the body available to route handlers at req.body
 *
 * https://github.com/expressjs/body-parser
 */
export const bodyParser = [
  {
    name: 'body-parser-url-encoded',
    function: bodyParserMiddleware.urlencoded(urlEncoded),
  },
  {
    name: 'body-parser-json',
    function: bodyParserMiddleware.json(json),
  },
];
