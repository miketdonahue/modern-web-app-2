"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.registerRoutes = void 0;
var express_1 = require("express");
var logger_1 = require("@server/modules/logger");
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
exports.registerRoutes = function (expressApp, nextApp, appRoutes) {
    if (appRoutes === void 0) { appRoutes = []; }
    return new Promise(function (resolve) {
        var expressServer = expressApp;
        var nextServer = nextApp;
        appRoutes.forEach(function (route) {
            var router = express_1["default"].Router();
            var _a = route.path, path = _a === void 0 ? '' : _a, _b = route.middleware, middleware = _b === void 0 ? [] : _b, _c = route.routes, routes = _c === void 0 ? [] : _c;
            logger_1.logger.info({ path: path }, 'REGISTER-ROUTES: Registering route path');
            middleware.forEach(function (middlewareFunc) {
                if (!middlewareFunc.name || !middlewareFunc["function"]) {
                    logger_1.logger.error({ middlewareFunc: middlewareFunc }, 'REGISTER-ROUTES: Ensure that each middleware is an object with a `name` and `function` property.');
                    throw new Error('Invalid middleware format');
                }
                logger_1.logger.info({ middleware: middlewareFunc.name }, 'REGISTER-ROUTES: Registering router-level middleware');
                router.use(function (req, res, next) {
                    return !req.url.startsWith('/_next')
                        ? middlewareFunc["function"](req, res, next)
                        : next();
                });
            });
            routes.forEach(function (action) {
                var _a = action.path, path = _a === void 0 ? '' : _a, // eslint-disable-line no-shadow
                _b = action.page, // eslint-disable-line no-shadow
                page = _b === void 0 ? '' : _b, _c = action.method, method = _c === void 0 ? '' : _c, _d = action.middleware, middleware = _d === void 0 ? [] : _d, // eslint-disable-line no-shadow
                _e = action.controller, // eslint-disable-line no-shadow
                controller = _e === void 0 ? null : _e;
                if (!page && (!path || !method || !controller)) {
                    logger_1.logger.error({ path: path, controller: controller }, 'REGISTER-ROUTES: Ensure that each route has a `path` and `controller` property.');
                    throw new Error('Invalid route format');
                }
                if (page && !path) {
                    logger_1.logger.error({ path: path, page: page }, 'REGISTER-ROUTES: Ensure a Next.js page has a `path`.');
                    throw new Error('Invalid Next.js route format');
                }
                if (page && (method || controller)) {
                    logger_1.logger.error({ path: path, page: page }, 'REGISTER-ROUTES: Next.js pages should not have a `method` or `controller`.');
                    throw new Error('Invalid Next.js route format');
                }
                logger_1.logger.info({ path: path, method: method.toUpperCase() }, 'REGISTER-ROUTES: Registering route action');
                router[page ? 'get' : method](path, middleware.map(function (m) {
                    logger_1.logger.info({ middleware: m.name }, 'REGISTER-ROUTES: Registering route action-level middleware');
                    return m["function"];
                }), page
                    ? function (req, res) {
                        return nextServer.render(req, res, page, __assign(__assign({}, req.query), req.params));
                    }
                    : controller);
            });
            expressServer.use(path, router);
        });
        resolve(appRoutes);
    });
};
