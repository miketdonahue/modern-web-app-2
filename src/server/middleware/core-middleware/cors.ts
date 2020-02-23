import corsSecurity from 'cors';
import { config } from '@config';

const { middleware } = config.server;

/**
 * CORS Security Middleware
 *
 * @remarks
 *
 * https://github.com/expressjs/cors
 */
export const cors = {
  name: 'cors',
  function: corsSecurity(middleware.cors),
};
