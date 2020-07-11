"use strict";
exports.__esModule = true;
exports.registerMiddleware = void 0;
var logger_1 = require("@server/modules/logger");
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
exports.registerMiddleware = function (app, middleware) {
    return new Promise(function (resolve) {
        var server = app;
        middleware.forEach(function (middlewareFunc) {
            if (!middlewareFunc.name || !middlewareFunc["function"]) {
                logger_1.logger.error({ middleware: middlewareFunc }, 'REGISTER-APP-MIDDLEWARE: Ensure that each middleware is an object with a `name` and `function` property.');
                throw new Error('Invalid middleware format');
            }
            logger_1.logger.info({ middleware: middlewareFunc.name }, 'REGISTER-APP-MIDDLEWARE: Registering application-level middleware');
            server.use(middlewareFunc["function"]);
        });
        resolve(middleware);
    });
};
