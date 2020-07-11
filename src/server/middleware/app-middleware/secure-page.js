"use strict";
exports.__esModule = true;
exports.securePage = exports.verifyJwt = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var universal_cookie_1 = require("universal-cookie");
var logger_1 = require("@server/modules/logger");
var _config_1 = require("@config");
exports.verifyJwt = function (req, onVerify) {
    var uc = new universal_cookie_1["default"](req.headers && req.headers.cookie);
    var uCookies = uc.getAll();
    var constructedToken = uCookies &&
        uCookies['token-payload'] &&
        uCookies['token-signature'] &&
        uCookies['token-payload'] + "." + uCookies['token-signature'];
    return jsonwebtoken_1["default"].verify(constructedToken, _config_1.config.server.auth.jwt.secret, function (err, decoded) {
        return onVerify(err, decoded);
    });
};
/**
 * Checks if a user is authenticated
 */
var securePageMiddleware = function (req, res, next) {
    return exports.verifyJwt(req, function (err, decoded) {
        if (err) {
            return res.redirect(302, '/app/login');
        }
        logger_1.logger.info("AUTHENTICATE-MIDDLEWARE: Authenticating user");
        // Add the decoded actor to req for continued access
        req.user = decoded;
        return next();
    });
};
exports.securePage = {
    name: 'secure-page',
    "function": securePageMiddleware
};
