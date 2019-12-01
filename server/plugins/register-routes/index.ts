import express, { Express, Request, Response, Router } from 'express';
import logger from '@server/modules/logger';
import { Route, Middleware, Action } from './typings';

interface ExpressRouter extends Router {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Registers a set of application routes against an Express.js HTTP server instance
 *
 * @param expressApp - An Express.js HTTP server instance
 * @param nextApp - A Next.js app instance
 * @param routes - An array of route objects
 * @returns An array of route objects
 *
 * ```ts
 * import { registerRoutes } from './plugins/register-routes'
 *
 * await registerRoutes(expressApp, nextApp, routes)
 * ```
 */
export const registerRoutes = (
  expressApp: Express,
  nextApp: any,
  appRoutes: Route[] = []
): Promise<any[]> =>
  new Promise(resolve => {
    const expressServer = expressApp;
    const nextServer = nextApp;

    appRoutes.forEach((route: Route) => {
      const router: ExpressRouter = express.Router();
      const { path = '', middleware = [], routes = [] } = route;

      logger.info({ path }, 'REGISTER-ROUTES: Registering route path');

      middleware.forEach((middlewareFunc: Middleware) => {
        if (!middlewareFunc.name || !middlewareFunc.function) {
          logger.error(
            { middlewareFunc },
            'REGISTER-ROUTES: Ensure that each middleware is an object with a `name` and `function` property.'
          );

          throw new Error('Invalid middleware format');
        }

        logger.info(
          { middleware: middlewareFunc.name },
          'REGISTER-ROUTES: Registering router-level middleware'
        );

        router.use((req, res, next) =>
          !req.url.startsWith('/_next')
            ? middlewareFunc.function(req, res, next)
            : next()
        );
      });

      routes.forEach((action: Action) => {
        const {
          path = '', // eslint-disable-line no-shadow
          page = '',
          method = '',
          middleware = [], // eslint-disable-line no-shadow
          controller = null,
        } = action;

        if (!page && (!path || !method || !controller)) {
          logger.error(
            { path, controller },
            'REGISTER-ROUTES: Ensure that each route has a `path` and `controller` property.'
          );

          throw new Error('Invalid route format');
        }

        if (page && !path) {
          logger.error(
            { path, page },
            'REGISTER-ROUTES: Ensure a Next.js page has a `path`.'
          );

          throw new Error('Invalid Next.js route format');
        }

        if (page && (method || controller)) {
          logger.error(
            { path, page },
            'REGISTER-ROUTES: Next.js pages should not have a `method` or `controller`.'
          );

          throw new Error('Invalid Next.js route format');
        }

        logger.info(
          { path, method: method.toUpperCase() },
          'REGISTER-ROUTES: Registering route action'
        );

        router[page ? 'get' : method](
          path,
          middleware.map((m: Middleware) => {
            logger.info(
              { middleware: m.name },
              'REGISTER-ROUTES: Registering route action-level middleware'
            );

            return m.function;
          }),
          page
            ? (req: Request, res: Response) =>
                nextServer.render(
                  req,
                  res,
                  page,
                  Object.assign({}, req.query, req.params)
                )
            : controller
        );
      });

      expressServer.use(path, router);
    });

    resolve(appRoutes);
  });
