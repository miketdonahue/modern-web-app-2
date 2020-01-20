import { RestClient } from '@server/modules/rest-client';

class Mailer extends RestClient {
  public willSendRequest(request: any): any {
    request.baseUrl.set(
      'https://api.mailgun.net/v3/sandbox347b766a2b56476eada91886bc7d1688.mailgun.org'
    );

    request.auth.set('api', process.env.MAILGUN_CLIENT);
  }
}

export { Mailer };
