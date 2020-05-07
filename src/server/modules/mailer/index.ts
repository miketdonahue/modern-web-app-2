import { Message } from './api/message';

export {
  WELCOME_EMAIL,
  CONFIRM_EMAIL,
  RESET_PASSWORD_EMAIL,
  UNLOCK_ACCOUNT_EMAIL,
} from './emails';

export const mailer = {
  message: new Message(),
};
