/**
 * New user welcome email options
 */
export const WELCOME_EMAIL = {
  from: 'no-reply@mail.com',
  subject: 'Welcome!',
  template: 'welcome',
  substitutionData: (actor: any) => ({
    firstName: actor.first_name,
    signInUrl: 'http://localhost:8080/app/login',
  }),
};

/**
 * Confirmation email options
 */
export const CONFIRM_EMAIL = {
  from: 'no-reply@mail.com',
  subject: 'Please confirm your email address',
  template: 'confirm-email',
  substitutionData: (actor: any) => ({
    firstName: actor.first_name,
    confirmedCode: actor.confirmed_code,
  }),
};

/**
 * Reset password email options
 */
export const RESET_PASSWORD_EMAIL = {
  from: 'no-reply@mail.com',
  subject: 'Reset your password',
  template: 'reset-password',
  substitutionData: (actor: any) => ({
    firstName: actor.first_name,
    resetPasswordCode: actor.reset_password_code,
    resetPasswordUrl: 'http://localhost:8080/app/reset-password',
  }),
};

/**
 * Account locked email options
 */
export const ACCOUNT_LOCKED_EMAIL = {
  from: 'no-reply@mail.com',
  subject: 'Your account has been locked',
  template: 'account-locked',
  substitutionData: (actor: any) => ({
    firstName: actor.first_name,
    unlockAccountUrl: 'http://localhost:8080/app/unlock-account',
  }),
};

/**
 * Unlock account email options
 */
export const UNLOCK_ACCOUNT_EMAIL = {
  from: 'no-reply@mail.com',
  subject: 'Unlock your account',
  template: 'unlock-account',
  substitutionData: (actor: any) => ({
    firstName: actor.first_name,
    lockedCode: actor.locked_code,
  }),
};
