import { rule } from 'graphql-shield';

/**
 * Checks if a user is authenticated
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns boolean
 */
export const isAuthenticated = rule()(
  async (parent, args, context) => !!context.actor
);
