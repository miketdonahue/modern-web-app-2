"use strict";
exports.__esModule = true;
exports.normalizeError = void 0;
var normalizers_1 = require("./normalizers");
/**
 * Normalizes errors based on the incoming source
 *
 * @param error - GraphQL Error object from Apollo Server
 * @returns A normalizing function
 */
var normalizeError = function (error) {
    var source = error.extensions.exception.source;
    // Some errors are not interceptable; Set a source here from some identifying property
    if (error.extensions.exception.name === 'ValidationError') {
        source = 'ValidationError';
    }
    switch (source) {
        case 'JsonWebToken':
            return normalizers_1["default"].jwt(error);
        case 'Mailgun':
            return normalizers_1["default"].mailgun(error);
        case 'Stripe':
            return normalizers_1["default"].stripe(error);
        case 'ValidationError':
            return normalizers_1["default"].validation(error);
        case 'InternalError':
            return {
                code: error.extensions.code,
                level: error.extensions.exception.level
            };
        default:
            return { code: error.extensions.code, level: 'error' };
    }
};
exports.normalizeError = normalizeError;
