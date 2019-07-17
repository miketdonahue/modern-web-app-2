import jwt from 'jsonwebtoken';
import gql from 'graphql-tag';
import { redirectTo } from '../redirect';
import { IGNORE_ROUTES } from './ignore-routes';

/**
 * Checks if a user is authenticated & authorized
 *
 * @remarks
 * This is a universal function that will take appropriate actions on the browser and server
 *
 * @param ctx - Next.js context
 * @returns Redirects to appropriate page
 */
export const checkAccess = async (ctx): Promise<any> => {
  const { apolloClient, req, pathname } = ctx;
  const urlPathname = process.browser ? pathname : req.url;

  // Ignore public routes
  if (IGNORE_ROUTES.includes(urlPathname)) return true;

  const VALIDATE_ACCESS = gql`
    query {
      payload: validateAccess {
        token
      }
    }
  `;

  const {
    data: { payload },
  } = await apolloClient.query({
    query: VALIDATE_ACCESS,
    fetchPolicy: 'no-cache',
  });

  const { token } = payload;
  const hasAccess = !!token;
  const decoded = jwt.decode(token);

  // Redirect authenticated requests to /login back to root path
  if (urlPathname === '/login' && hasAccess) {
    return redirectTo(ctx, '/');
  }

  // Redirect all unauthenticated requests to /login
  if (urlPathname !== '/login' && !hasAccess) {
    return redirectTo(ctx, '/login');
  }

  // Redirect all unauthorized route access requests to root
  if (hasAccess && decoded.role.prohibitedRoutes.includes(pathname)) {
    return redirectTo(ctx, '/');
  }

  return undefined;
};
