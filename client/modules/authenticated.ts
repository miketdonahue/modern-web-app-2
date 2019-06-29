import Cookies from 'universal-cookie';
import gql from 'graphql-tag';
import { redirectTo } from './redirect';

export const checkAuthentication = async (ctx): Promise<any> => {
  const { apolloClient, req, pathname } = ctx;
  const urlPathname = process.browser ? pathname : req.url;
  const universalCookies = process.browser
    ? document.cookie
    : req.headers.cookie;
  const cookies = new Cookies(universalCookies);
  const token = cookies.get('usr') || '';

  const IS_AUTHENTICATED = gql`
    query isAuthenticated($input: IsAuthenticatedInput!) {
      isAuthenticated(input: $input)
    }
  `;

  const {
    data: { isAuthenticated },
  } = await apolloClient.query({
    query: IS_AUTHENTICATED,
    variables: { input: { token } },
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
