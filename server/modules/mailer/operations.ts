import SparkPost from 'sparkpost';
import config from '@config';
import logger from '@server/modules/logger';
import { ExternalError } from '../errors';

const emailClient = new SparkPost(process.env.SPARKPOST);

/**
 * Send email transmission
 *
 * @param user - Information about the user
 * @param options - SparkPost transmission options
 * @param options.campaignId - SparkPost campaign_id
 * @param options.templateId - SparkPost template_id
 * @param options.substitutionData - SparkPost email template data
 * @returns Promise
 */
export const send = async (user, options): Promise<any> => {
  if (!config.server.mailer.sendEmails) {
    return new Promise(resolve => resolve());
  }

  try {
    const data = await emailClient.transmissions.send({
      campaign_id: options.campaignId,
      metadata: {
        cuid: user.id,
      },
      options: {
        skip_suppression: false,
      },
      content: {
        template_id: options.templateId,
      },
      recipients: [
        {
          address: {
            name: user.firstName,
            email: user.email,
          },
          substitution_data: options.substitutionData(user),
        },
      ],
    });

    logger.info(
      {
        results: data.results,
        campaignId: options.campaignId,
        templateId: options.templateId,
      },
      `Sent email to user: ${user.id}`
    );
  } catch (error) {
    throw new ExternalError(error, { source: 'SparkPost' });
  }

  return undefined;
};
