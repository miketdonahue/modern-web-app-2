import { config } from '@config';
import { Actor } from '@typings/entities/actor';
import { BookReceipt } from '@typings/mailer';

/**
 * New user welcome email options
 */
export const WELCOME_EMAIL = {
  from: 'no-reply@local-mdonahue.com',
  subject: 'Welcome!',
  templateId: 'd-c44af4952a6240d49ca9db8bfb0ab72d',
  substitutionData: (data: Actor) => ({
    email: data.email,
    firstName: data.first_name,
  }),
};

/**
 * Confirmation email options
 */
export const CONFIRM_EMAIL = {
  from: 'no-reply@local-mdonahue.com',
  subject: 'Confirm your email address',
  templateId: 'd-3c4980342dad426bb40997dffc0d47a7',
  substitutionData: (data: Actor & { confirmed_code: string }) => ({
    email: data.email,
    firstName: data.first_name,
    code: data.confirmed_code,
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
  substitutionData: (data: Actor & { reset_password_code: string }) => ({
    email: data.email,
    firstName: data.first_name,
    code: data.reset_password_code,
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
  substitutionData: (data: Actor) => ({
    email: data.email,
    firstName: data.first_name,
  }),
};

/**
 * Unlock account email options
 */
export const UNLOCK_ACCOUNT_EMAIL = {
  from: 'no-reply@local-mdonahue.com',
  subject: 'Unlock your account',
  templateId: 'd-077d6366c5994d50aa1220b2662a54b8',
  substitutionData: (data: Actor & { locked_code: string }) => ({
    email: data.email,
    firstName: data.first_name,
    code: data.locked_code,
    expiresIn: config.server.auth.codes.expireTime,
  }),
};

/**
 * Receipt for book purchase
 */
export const BOOK_RECEIPT_EMAIL = {
  from: 'no-reply@local-mdonahue.com',
  subject: 'Your book is ready to download',
  templateId: 'd-838de3fc2c544502ba1a568406f9da87',
  substitutionData: (data: BookReceipt) => ({
    email: data.email,
    firstName: data.first_name,
    amountPaid: data.amount_total,
    datePaid: data.date_paid,
    paymentMethodDetails: data.payment_method_details,
    amountCharged: data.amount_total,
    orderNumber: data.order_number,
    supportEmail: 'support@mail.com',
  }),
};
