import { createHttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import { config } from '@config';

const { host, port, graphql } = config.server;

/**
 * Creates an Http Link to the Apollo Server
 *
 * @remarks
 * This is middleware for Apollo Client
 *
 * @param options - A hash of createHttpLink options
 * @returns An Apollo Link
 */
export const httpMiddleware = createHttpLink({
  uri: `${host}:${port}${graphql.path}`,
  credentials: 'same-origin',
  fetch,
});
