import bodyParser from 'body-parser';
import * as controller from './controller';

export default {
  path: '/api/v1/webhooks',
  routes: [
    {
      path: '/stripe',
      method: 'post',
      middleware: [
        {
          name: 'body-parser-raw',
          function: bodyParser.raw({ type: 'application/json' }),
        },
      ],
      controller: controller.stripePaymentsWebhook,
    },
  ],
};
