import { createHttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import config from '../../config';

const { host, port, graphql } = config.server;

export const httpMiddleware = createHttpLink({
  uri: `${host}:${port}${graphql.path}`,
  credentials: 'same-origin',
  useGETForQueries: true,
  fetch,
});
