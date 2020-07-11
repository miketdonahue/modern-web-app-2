"use strict";
exports.__esModule = true;
/**
 * JsonWebToken error normalizer
 *
 * @param error - GraphQL Error object from Apollo Server
 * @returns A standardized error code and logger level
 */
exports["default"] = (function (error) {
    var errorInfo = { code: 'JWT', level: 'warn' };
    switch (error.extensions.exception.name) {
        case 'JsonWebTokenError':
            errorInfo.code = 'JWT_INVALID';
            break;
        case 'TokenExpiredError':
            errorInfo.code = 'JWT_EXPIRED';
            break;
        default:
            break;
    }
    return errorInfo;
});
