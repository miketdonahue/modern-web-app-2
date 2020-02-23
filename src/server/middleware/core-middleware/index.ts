import { Middleware } from '@server/plugins/register-middleware/typings';
import { bodyParser } from './body-parser';
import { cookieParser } from './cookie-parser';
import { cors } from './cors';
import { csrf } from './csrf';
import { helmet } from './helmet';

/* Order is important */
export const coreMiddleware: Middleware[] = [
  cors,
  ...helmet,
  ...bodyParser,
  cookieParser,
  csrf,
];
