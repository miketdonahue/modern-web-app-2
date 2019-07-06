import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { fileLoader } from '@utils/file-loaders/webpack';
import { mergeResolvers } from '@utils/merge-resolvers/client';
import { httpMiddleware, headersMiddleware } from '@client/middleware';

// Register types and resolvers
const typesArray = fileLoader('typeDefs');
const resolvers = mergeResolvers();

let apolloClient = null;

/**
 * Creates an Apollo Client instance
 *
 * @param initialState - The initial state of the cache
 * @param metadata - A set of metadata to be used in the client
 * @param metadata.cookies - The application cookies
 * @returns Instance of Apollo Client
 */
const createApolloClient = (initialState, { cookies }): any => {
  const client = new ApolloClient({
    name: 'web',
    ssrMode: !process.browser,
    link: from([headersMiddleware(cookies), httpMiddleware]),
    cache: new InMemoryCache().restore(initialState || {}),
    typeDefs: [...typesArray], // extends server types
    resolvers,
  });

  return client;
};

/**
 * Initialize Apollo Client
 *
 * @remarks
 * The function will initialize the client based on domain, server vs. browser
 *
 * @param initialState - The initial state of the cache
 * @param metaData - The metadata object
 * @returns The Apollo Client instance
 */
export default function initApollo(initialState, metaData): any {
  // Create a new Apollo Client for every server-side request
  // so data is not shared between connections
  if (!process.browser) {
    return createApolloClient(initialState, metaData);
  }

  // Ensure Apollo Client is reused client-side for continued
  // access to the cache
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState, metaData);
  }

  return apolloClient;
}
