import { config } from '@config';
import { Actor } from '@typings/entities/actor';

/**
 * New user welcome email options
 */
export const WELCOME_EMAIL = {
  from: 'no-reply@local-mdonahue.com',
  subject: 'Welcome!',
  templateId: 'd-c44af4952a6240d49ca9db8bfb0ab72d',
  substitutionData: (actor: Actor) => ({
    email: actor.email,
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
  substitutionData: (actor: Actor & { confirmed_code: string }) => ({
    email: actor.email,
    firstName: actor.first_name,
    code: actor.confirmed_code,
    expiresIn: config.server.auth.codes.expireTime,
  }),
};

/**
 * Reset password email options
 */
export const RESET_PASSWORD_EMAIL = {
  from: 'no-reply@local-mdonahue.com',
  subject: 'Reset your password',
  templateId: 'd-ae0dedc4f95443b5bf2483bd9d3cc8c7',
  substitutionData: (actor: Actor & { reset_password_code: string }) => ({
    email: actor.email,
    firstName: actor.first_name,
    code: actor.reset_password_code,
    expiresIn: config.server.auth.codes.expireTime,
  }),
};

/**
 * Account locked email options
 */
export const ACCOUNT_LOCKED_EMAIL = {
  from: 'no-reply@local-mdonahue.com',
  subject: 'Your account has been locked',
  templateId: 'd-45b740c67f054213887265d806682d30',
  substitutionData: (actor: Actor) => ({
    email: actor.email,
    firstName: actor.first_name,
  }),
};

/**
 * Unlock account email options
 */
export const UNLOCK_ACCOUNT_EMAIL = {
  from: 'no-reply@local-mdonahue.com',
  subject: 'Unlock your account',
  templateId: 'd-077d6366c5994d50aa1220b2662a54b8',
  substitutionData: (actor: Actor & { locked_code: string }) => ({
    email: actor.email,
    firstName: actor.first_name,
    code: actor.locked_code,
    expiresIn: config.server.auth.codes.expireTime,
  }),
};
