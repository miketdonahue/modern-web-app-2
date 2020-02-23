import { Express } from 'express';
import { logger } from '@server/modules/logger';
import { Middleware } from './typings';

/**
 * Registers middleware against an Express.js HTTP server instance
 *
 * @param app - An Express.js HTTP server instance
 * @param middleware - An array of middleware objects
 * @returns An array of middleware objects
 *
 * ```ts
 * import { registerMiddleware } from './plugins/register-middleware'
 *
 * await registerMiddleware(expressServer, middleware)
 * ```
 */
export const registerMiddleware = (
  app: Express,
  middleware: Middleware[]
): Promise<Middleware[]> =>
  new Promise(resolve => {
    const server = app;

    middleware.forEach((middlewareFunc: Middleware) => {
      if (!middlewareFunc.name || !middlewareFunc.function) {
        logger.error(
          { middleware: middlewareFunc },
          'REGISTER-APP-MIDDLEWARE: Ensure that each middleware is an object with a `name` and `function` property.'
        );

        throw new Error('Invalid middleware format');
      }

      logger.info(
        { middleware: middlewareFunc.name },
        'REGISTER-APP-MIDDLEWARE: Registering application-level middleware'
      );

      server.use(middlewareFunc.function);
    });

    resolve(middleware);
  });
