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
export const headersMiddleware = (cookies): any =>
  new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => {
      const cookie = new Cookies(cookies());
      const jwtToken = cookie.get('token');
      const csrfToken = cookie.get('csrf');

      return {
        headers: {
          ...headers,
          authorization: jwtToken ? `Bearer ${jwtToken}` : null,
          'CSRF-Token': csrfToken,
        },
      };
    });

    if (forward) {
      return forward(operation);
    }

    return null;
  });
