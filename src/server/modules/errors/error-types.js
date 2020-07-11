"use strict";
exports.__esModule = true;
exports.errorTypes = void 0;
exports.errorTypes = {
    UNAUTHENTICATED: {
        code: 'UNAUTHENTICATED',
        detail: 'You are not authenticated and thus cannot perform this action.'
    },
    INVALID_CREDENTIALS: {
        code: 'INVALID_CREDENTIALS',
        detail: "Oops, you've entered an invalid email and/or password. Please try again."
    },
    CODE_NOT_FOUND: {
        code: 'CODE_NOT_FOUND',
        detail: 'Your verification code is invalid.'
    }
};
