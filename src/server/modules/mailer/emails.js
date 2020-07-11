"use strict";
exports.__esModule = true;
exports.UNLOCK_ACCOUNT_EMAIL = exports.ACCOUNT_LOCKED_EMAIL = exports.RESET_PASSWORD_EMAIL = exports.CONFIRM_EMAIL = exports.WELCOME_EMAIL = void 0;
/**
 * New user welcome email options
 */
exports.WELCOME_EMAIL = {
    from: 'no-reply@mail.com',
    subject: 'Welcome!',
    template: 'welcome',
    substitutionData: function (actor) { return ({
        firstName: actor.first_name,
        signInUrl: 'http://localhost:8080/app/login'
    }); }
};
/**
 * Confirmation email options
 */
exports.CONFIRM_EMAIL = {
    from: 'no-reply@mail.com',
    subject: 'Please confirm your email address',
    template: 'confirm-email',
    substitutionData: function (actor) { return ({
        firstName: actor.first_name,
        confirmedCode: actor.confirmed_code
    }); }
};
/**
 * Reset password email options
 */
exports.RESET_PASSWORD_EMAIL = {
    from: 'no-reply@mail.com',
    subject: 'Reset your password',
    template: 'reset-password',
    substitutionData: function (actor) { return ({
        firstName: actor.first_name,
        resetPasswordCode: actor.reset_password_code,
        resetPasswordUrl: 'http://localhost:8080/app/reset-password'
    }); }
};
/**
 * Account locked email options
 */
exports.ACCOUNT_LOCKED_EMAIL = {
    from: 'no-reply@mail.com',
    subject: 'Your account has been locked',
    template: 'account-locked',
    substitutionData: function (actor) { return ({
        firstName: actor.first_name,
        unlockAccountUrl: 'http://localhost:8080/app/unlock-account'
    }); }
};
/**
 * Unlock account email options
 */
exports.UNLOCK_ACCOUNT_EMAIL = {
    from: 'no-reply@mail.com',
    subject: 'Unlock your account',
    template: 'unlock-account',
    substitutionData: function (actor) { return ({
        firstName: actor.first_name,
        lockedCode: actor.locked_code
    }); }
};
