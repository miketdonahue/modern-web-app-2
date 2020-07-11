"use strict";
exports.__esModule = true;
exports.secureApi = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var universal_cookie_1 = require("universal-cookie");
var errors_1 = require("@server/modules/errors");
var logger_1 = require("@server/modules/logger");
var _config_1 = require("@config");
/**
 * Checks if a user is authenticated
 */
var secureApiMiddleware = function (req, res, next) {
    var token = '';
    var headerParts = (req.headers.authorization && req.headers.authorization.split(' ')) || [];
    if (headerParts.length === 2) {
        var scheme = headerParts[0];
        var credentials = headerParts[1];
        if (/^Bearer$/i.test(scheme)) {
            token = credentials;
        }
    }
    var uc = new universal_cookie_1["default"](req.headers && req.headers.cookie);
    var uCookies = uc.getAll();
    var constructedToken = uCookies && uCookies['token-signature']
        ? token + "." + uCookies['token-signature']
        : token;
    return jsonwebtoken_1["default"].verify(constructedToken, _config_1.config.server.auth.jwt.secret, function (err, decoded) {
        if (err) {
            logger_1.logger.error({ err: err }, "AUTHENTICATE-MIDDLEWARE: Failed to verify token");
            var response = {
                error: [
                    {
                        status: '401',
                        code: errors_1.errorTypes.UNAUTHENTICATED.code,
                        detail: errors_1.errorTypes.UNAUTHENTICATED.detail
                    },
                ]
            };
            return res.status(401).json(response);
        }
        logger_1.logger.info("AUTHENTICATE-MIDDLEWARE: Authenticating user");
        // Add the decoded actor to req for continued access
        req.user = decoded;
        return next();
    });
};
exports.secureApi = { name: 'secure-api', "function": secureApiMiddleware };
