import { Message } from './api/message';

export {
  WELCOME_EMAIL,
  CONFIRMATION_EMAIL,
  RESET_PASSWORD_EMAIL,
  UNLOCK_ACCOUNT_EMAIL,
} from './emails';

export const mailer = {
  message: new Message(),
};
