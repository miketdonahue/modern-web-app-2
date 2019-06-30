import { rule } from 'graphql-shield';
import config from '@config';

/**
 * Checks if a user is authenticated
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {Boolean} - If authenticated or not
 */
export const isAuthenticated = rule()(
  async (parent, args, context, info) => !!context.user
);
