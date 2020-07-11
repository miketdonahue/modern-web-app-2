"use strict";
exports.__esModule = true;
exports.csrf = void 0;
var csurf_1 = require("csurf");
var _config_1 = require("@config");
var middleware = _config_1.config.server.middleware;
/**
 * CSRF Security Middleware
 *
 * @remarks
 *
 * https://github.com/expressjs/csurf
 */
exports.csrf = {
    name: 'csrf',
    "function": function (req, res, next) {
        return csurf_1["default"](middleware.csrf)(req, res, next);
    }
};
