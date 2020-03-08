import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { fileLoader } from '@utils/file-loaders/webpack';
import { mergeResolvers } from '@utils/merge-resolvers/client';
import { httpMiddleware, headersMiddleware } from './middleware';

// Register types and resolvers
const typesArray = fileLoader('typeDefs');
const resolvers = mergeResolvers();

// On the client, we store the Apollo Client in the following variable.
// This prevents the client from re-initializing between page transitions.
let globalApolloClient = null;

/**
 * Creates an Apollo Client instance
 *
 * @param initialState - The initial state of the cache
 * @param context - Next.js page context
 * @returns Instance of Apollo Client
 */
const createApolloClient = (initialState, context): any => {
  // The `context` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (context.req) or similar.
  const cookies =
    context && context.req && context.req.headers && context.req.headers.cookie;

  const client = new ApolloClient({
    ssrMode: Boolean(context),
    link: from([headersMiddleware(cookies), httpMiddleware]),
    cache: new InMemoryCache().restore(initialState || {}),
    typeDefs: [...typesArray], // extends server types
    resolvers, // extends server resolvers
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
 * @param context - Next.js page context
 * @returns The Apollo Client instance
 */
export const initApolloClient = (initialState, context): any => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(initialState, context);
  }

  // Reuse client on the client-side
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState, context);
  }

  return globalApolloClient;
};

/**
 * Installs the Apollo Client on NextPageContext
 * or NextAppContext. Useful if you want to use apolloClient
 * inside getStaticProps, getStaticPaths or getServerProps
 * @param {NextPageContext | NextAppContext} context
 */
export const initOnContext = context => {
  const inAppContext = Boolean(context.ctx);

  // We consider installing `withApollo({ ssr: true })` on global App level
  // as antipattern since it disables project wide Automatic Static Optimization.
  if (process.env.NODE_ENV === 'development') {
    if (inAppContext) {
      console.warn(
        'Warning: You have opted-out of Automatic Static Optimization due to `withApollo` in `pages/_app`.\n' +
          'Read more: https://err.sh/next.js/opt-out-auto-static-optimization\n'
      );
    }
  }

  // Initialize ApolloClient if not already done
  const apolloClient =
    context.apolloClient ||
    initApolloClient(
      context.apolloState || {},
      inAppContext ? context.ctx : context
    );

  // We send the Apollo Client as a prop to the component to avoid calling initApollo() twice in the server.
  // Otherwise, the component would have to call initApollo() again but this
  // time without the context. Once that happens, the following code will make sure we send
  // the prop as `null` to the browser.
  apolloClient.toJSON = () => null;

  // Add apolloClient to NextPageContext & NextAppContext.
  // This allows us to consume the apolloClient inside our
  // custom `getInitialProps({ apolloClient })`.
  context.apolloClient = apolloClient;
  if (inAppContext) {
    context.ctx.apolloClient = apolloClient;
  }

  return context;
};
