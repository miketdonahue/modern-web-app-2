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
exports.logger = void 0;
var pino_1 = require("pino");
var path_1 = require("path");
var uuid_1 = require("uuid");
var _config_1 = require("@config");
var destination = path_1["default"].join(process.cwd(), 'src/server/logs/app.log');
if (process.env.NODE_ENV !== 'production') {
    destination = pino_1["default"].destination(1);
}
/**
 * Creates a server-side logger instance
 */
var defaultLogger = pino_1["default"]({
    name: 'web-server',
    level: _config_1.config.server.logger.level,
    enabled: _config_1.config.server.logger.enabled,
    redact: {
        paths: [],
        remove: true
    },
    prettyPrint: _config_1.config.server.logger.pretty
}, destination);
/**
 * Creates a child instance of the default logger
 *
 * @returns {Function} - Pino child logger instance
 */
var logger = defaultLogger.child({
    serializers: {
        req: function (req) {
            if (!req) {
                return false;
            }
            var whitelistedHeaders = function () {
                var headers = __assign({}, req.headers);
                if (_config_1.config.server.logger.level !== 'debug') {
                    delete headers.authorization;
                    delete headers.cookie;
                    delete headers['csrf-token'];
                }
                return headers;
            };
            return {
                id: uuid_1.v4(),
                query: req.query,
                params: req.params,
                method: req.method,
                url: req.url,
                body: req.body,
                headers: whitelistedHeaders(),
                httpVersion: req.httpVersion,
                ip: req.ip
            };
        },
        res: function (res) {
            if (!res) {
                return false;
            }
            return {
                statusCode: res.statusCode,
                headers: res.header
            };
        },
        args: function (args) {
            var whitelistArgs = __assign({}, args.input);
            if (_config_1.config.server.logger.level !== 'debug') {
                delete whitelistArgs.firstName;
                delete whitelistArgs.lastName;
                delete whitelistArgs.email;
                delete whitelistArgs.password;
                delete whitelistArgs.answers;
                delete whitelistArgs.token;
            }
            return __assign({}, whitelistArgs);
        }
    }
});
exports.logger = logger;
