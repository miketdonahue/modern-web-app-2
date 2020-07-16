/**
 * New user welcome email options
 */
export const WELCOME_EMAIL = {
  from: 'no-reply@local-mdonahue.com',
  subject: 'Welcome!',
  templateId: 'd-c44af4952a6240d49ca9db8bfb0ab72d',
  substitutionData: (actor: any) => ({
    firstName: actor.first_name,
  }),
};

/**
 * Confirmation email options
 */
export const CONFIRM_EMAIL = {
  from: 'no-reply@local-mdonahue.com',
  subject: 'Confirm your email address',
  templateId: 'd-3c4980342dad426bb40997dffc0d47a7',
  substitutionData: (actor: any) => ({
    firstName: actor.first_name,
    code: actor.confirmed_code,
  }),
};

/**
 * Reset password email options
 */
export const RESET_PASSWORD_EMAIL = {
  from: 'no-reply@local-mdonahue.com',
  subject: 'Reset your password',
  templateId: 'd-ae0dedc4f95443b5bf2483bd9d3cc8c7',
  substitutionData: (actor: any) => ({
    firstName: actor.first_name,
    code: actor.reset_password_code,
  }),
};

/**
 * Account locked email options
 */
export const ACCOUNT_LOCKED_EMAIL = {
  from: 'no-reply@local-mdonahue.com',
  subject: 'Your account has been locked',
  template: 'account-locked',
  substitutionData: (actor: any) => ({
    firstName: actor.first_name,
  }),
};

/**
 * Unlock account email options
 */
export const UNLOCK_ACCOUNT_EMAIL = {
  from: 'no-reply@local-mdonahue.com',
  subject: 'Unlock your account',
  template: 'unlock-account',
  substitutionData: (actor: any) => ({
    firstName: actor.first_name,
    code: actor.locked_code,
  }),
};
