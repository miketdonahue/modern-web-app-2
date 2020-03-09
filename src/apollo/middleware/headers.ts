import { ApolloLink } from 'apollo-link';
import Cookies from 'universal-cookie';

/**
 * Inject headers for the GraphQL request
 *
 * @remarks
 * This is middleware for Apollo Client
 *
 * @param cookies - A string of application cookies
 * @returns Forwards the operation to the next middleware
 */
export const headersMiddleware = (cookies: any) =>
  new ApolloLink((operation, forward) => {
    operation.setContext(() => {
      const uc = new Cookies(cookies);
      const uCookies = uc.getAll();

      const getAuthorizationHeader = (cookie: any) => {
        if (cookie['token-signature']) {
          return `${cookie['token-payload']}.${cookie['token-signature']}`;
        }

        return cookie['token-payload'];
      };

      return {
        headers: {
          Authorization: `Bearer ${getAuthorizationHeader(uCookies)}`,
          'X-Requested-With': 'XmlHttpRequest',
        },
      };
    });

    if (forward) {
      return forward(operation);
    }

    return null;
  });
