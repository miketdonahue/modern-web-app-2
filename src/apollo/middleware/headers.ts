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
      const cookie = new Cookies(cookies);
      const jwtToken = cookie.get('token');

      return {
        headers: {
          Authorization: jwtToken ? `Bearer ${jwtToken}` : null,
          'X-Requested-With': 'XmlHttpRequest',
        },
      };
    });

    if (forward) {
      return forward(operation);
    }

    return null;
  });
