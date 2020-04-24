import querystring from 'querystring';
import { config } from '@config';
import { Mailer } from './base';
import { ExternalError } from '../../errors';

class Message extends Mailer {
  public async sendMessage(actor: any, options: any): Promise<any> {
    if (!config.server.mailer.sendEmails) {
      return new Promise((resolve) => resolve({}));
    }

    const { response, error } = await this.post(
      '/messages',
      querystring.stringify({
        from: options.from,
        to: actor.email,
        subject: options.subject,
        template: options.template,
        'h:X-Mailgun-Variables': JSON.stringify(
          options.substitutionData(actor)
        ),
      })
    );

    if (error) {
      throw new ExternalError(error, { source: 'Mailgun' });
    }

    return { response };
  }
}

export { Message };
