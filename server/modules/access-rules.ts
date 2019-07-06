import { rule } from 'graphql-shield';
import config from '@config';

/**
 * Checks if a user is authenticated
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns boolean
 */
export const isAuthenticated = rule()(
  async (parent, args, context, info) => !!context.user
);
