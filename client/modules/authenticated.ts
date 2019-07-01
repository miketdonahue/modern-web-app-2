import gql from 'graphql-tag';
import { redirectTo } from './redirect';

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

  if (urlPathname === '/login' && isAuthenticated) {
    return redirectTo(ctx, '/');
  }

  if (urlPathname !== '/login' && !isAuthenticated) {
    return redirectTo(ctx, '/login');
  }

  return undefined;
};
