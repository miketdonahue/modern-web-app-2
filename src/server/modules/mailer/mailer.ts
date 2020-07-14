import AWS from 'aws-sdk';
import { config } from '@config';
import { logger } from '@server/modules/logger';

type Data = {
  from: string;
  subject: string;
  template: string;
  substitutionData?: (actor: any) => void;
};

/**
 * Send a templated email
 */
const sendEmail = async (actor: any, data: Data) => {
  if (!config.server.mailer.sendEmails) {
    return new Promise((resolve) => resolve({}));
  }

  const createTemplate = new AWS.SES()
    .sendTemplatedEmail({
      Destination: {
        // ToAddresses: [actor.email],
        ToAddresses: ['no-reply@local-mdonahue.com'],
      },
      Source: data.from,
      Template: data.template,
      TemplateData: data.substitutionData
        ? JSON.stringify(data.substitutionData(actor))
        : '',
    })
    .promise();

  try {
    const response = await createTemplate;
    logger.info({ response }, 'MAILER: Email successfully sent');
  } catch (err) {
    logger.error({ err }, 'MAILER: Email failed to send');
  }
};

export { sendEmail };
