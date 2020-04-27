import jwt from 'jsonwebtoken';
import gql from 'graphql-tag';
import { redirectTo } from '../redirect';

/**
 * Checks if a user is authenticated & authorized
 *
 * @remarks
 * This is a universal function that will take appropriate actions on the browser and server
 *
 * @param ctx - Next.js context
 * @returns Redirects to appropriate page
 */
export const checkAccess = async (ctx: any): Promise<any> => {
  const { apolloClient, req, pathname } = ctx;
  const urlPathname = typeof window !== 'undefined' ? pathname : req && req.url;

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
    fetchPolicy: 'network-only',
  });

  const { token } = payload;
  const hasAccess = !!token;
  const decoded: any = jwt.decode(token);

  // Redirect authenticated requests to /app/login back to root path
  if (urlPathname === '/app/login' && hasAccess) {
    return redirectTo(ctx, '/app');
  }

  // Redirect all unauthenticated requests to /app/login
  if (urlPathname !== '/app/login' && !hasAccess) {
    return redirectTo(ctx, '/app/login');
  }

  // Redirect all unauthorized route access requests to root
  if (
    hasAccess &&
    decoded &&
    decoded.role &&
    decoded.role.prohibited_routes.includes(pathname)
  ) {
    return redirectTo(ctx, '/app');
  }

  return undefined;
};
