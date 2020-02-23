import helmetSecurity from 'helmet';
import { config } from '@config';

const { middleware } = config.server;

/**
 * Helmet Security Middleware
 *
 * @remarks
 *
 * https://github.com/helmetjs/helmet
 */
export const helmet = [
  { name: 'helmet', function: helmetSecurity() },
  {
    name: 'helmet-referrer-policy',
    function: helmetSecurity.referrerPolicy(middleware.helmet.referrerPolicy),
  },
  {
    name: 'helmet-csp',
    function: helmetSecurity.contentSecurityPolicy({
      directives: config.server.contentSecurityPolicy,
    }),
  },
];
