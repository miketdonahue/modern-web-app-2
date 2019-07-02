import gql from 'graphql-tag';
import { redirectTo } from './redirect';

/**
 * Checks is a user is authenticated
 *
 * @remarks
 * This is a universal function that will take appropriate actions on the browser and server
 *
 * @param ctx - Next.js context
 * @returns Redirects to appropriate page
 */
export const checkAuthentication = async (ctx): Promise<any> => {
  const { apolloClient, req, pathname } = ctx;
  const urlPathname = process.browser ? pathname : req.url;

  const IS_AUTHENTICATED = gql`
    query {
      isAuthenticated
    }
  `;

  const {
    data: { isAuthenticated },
  } = await apolloClient.query({
    query: IS_AUTHENTICATED,
    fetchPolicy: 'no-cache',
  });

  // Redirect authenticated requests to /login back to root path
  if (urlPathname === '/login' && isAuthenticated) {
    return redirectTo(ctx, '/');
  }

  // Redirect all unauthenticated requests to /login
  if (urlPathname !== '/login' && !isAuthenticated) {
    return redirectTo(ctx, '/login');
  }

  return undefined;
};
