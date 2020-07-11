"use strict";
exports.__esModule = true;
/**
 * Validation error normalizer
 *
 * @param error - GraphQL Error object from Apollo Server
 * @returns A standardized error code and logger level
 */
exports["default"] = (function (error) {
    // eslint-disable-next-line no-param-reassign
    delete error.extensions.exception.value;
    return { code: 'VALIDATION_ERROR', level: 'warn' };
});
