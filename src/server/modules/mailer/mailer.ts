import sgClient from '@sendgrid/client';
import { config } from '@config';
import { logger } from '@server/modules/logger';

sgClient.setApiKey(process.env.SENDGRID_API_KEY || '');

type Data = {
  from: string;
  subject: string;
  templateId: string;
  substitutionData?: (actor: any) => void;
};

/**
 * Send a templated email
 */
const sendEmail = async (actor: any, data: Data) => {
  if (!config.server.mailer.sendEmails) {
    return new Promise((resolve) => resolve({}));
  }

  try {
    const [response, body] = await sgClient.request({
      method: 'POST',
      url: '/v3/mail/send',
      body: {
        personalizations: [
          {
            to: [
              {
                // email: actor.email,
                email: 'no-reply@local-mdonahue.com',
                name:
                  actor.first_name && actor.last_name
                    ? `${actor.first_name} ${actor.last_name}`
                    : 'Friend',
              },
            ],
            dynamic_template_data:
              (data.substitutionData && data.substitutionData(actor)) || {},
            subject: data.subject,
          },
        ],
        from: {
          email: 'no-reply@local-mdonahue.com',
          name: 'Company',
        },
        template_id: data.templateId,
      },
    });

    logger.info({ response, body }, 'MAILER: Email successfully sent');
  } catch (err) {
    logger.error({ err }, 'MAILER: Email failed to send');
  }

  return undefined;
};

export { sendEmail };
