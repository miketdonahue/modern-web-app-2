import express from 'express';
import next from 'next';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { prisma } from '@server/prisma/generated/prisma-client';
import { normalizeError } from '@server/modules/errors';
import { HealthCheck } from '@server/modules/health-check';
import logger from '@server/modules/logger';
import { fileLoader } from '@utils/file-loaders/node';
import { mergeResolvers } from '@utils/merge-resolvers/server';
import config from '@config';
import {
  access,
  authenticate as isAuthenticated,
  validations,
  requestLogger,
  resolverLogger,
} from '@server/middleware';

const dev = process.env.NODE_ENV !== 'production';
const healthCheck = new HealthCheck();
const app = next({ dev });
const handle = app.getRequestHandler();

// Register types and resolvers
const typesArray = fileLoader('typeDefs');
const resolvers = mergeResolvers();
const routes = fileLoader('routes', { flatten: true });

// Set up root types
const rootTypes = `
  type Query { root: String }
  type Mutation { root: String }
  type Subscription { root: String }
`;

// GraphQL schemas, middleware, and server setup
const graphqlSchema = makeExecutableSchema({
  typeDefs: [rootTypes, ...typesArray],
  resolvers,
});

const schema = applyMiddleware(
  graphqlSchema,
  resolverLogger,
  access,
  validations
);

const apollo = new ApolloServer({
  schema,
  context: async ({ req, res }) => ({
    req,
    res,
    user: isAuthenticated(req.headers),
    prisma,
  }),
  playground: config.server.graphql.playground,
  debug: config.server.graphql.debug,
  formatError: error => {
    const err = error;
    const { code, level } = normalizeError(err);

    // Ensures a more descriptive "code" is set for every error
    err.extensions.code = code;

    logger[level]({ err }, `${err.name}: ${err.message}`);
    return err;
  },
});

app
  .prepare()
  .then(() => {
    const server = express();
    const { host, port } = config.server;

    server.use(
      cors({
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );
    server.use(helmet());
    server.use(helmet.referrerPolicy({ policy: 'same-origin' }));
    server.use(requestLogger());
    server.use(cookieParser());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(csrf({ cookie: { key: 'ds_csrf' } }));
    server.use(
      helmet.contentSecurityPolicy({
        directives: config.server.contentSecurityPolicy,
      })
    );

    // Apply Express middleware to GraphQL server
    apollo.applyMiddleware({
      app: server,
      path: config.server.graphql.path,
      cors: {
        origin: 'same-origin',
        credentials: true,
        optionsSuccessStatus: 200,
      },
      bodyParserConfig: true,
    });

    routes.forEach(function defineRoutes(obj) {
      const { route, page = null, middleware = [], controller = null } = obj;

      if (!page) {
        server.get(route, middleware, controller);
      }

      server.get(route, (req, res) =>
        app.render(
          req,
          res,
          `/${page}`,
          Object.assign({}, req.query, req.params)
        )
      );
    });

    // Health & graceful shutdown
    server.get('/health/liveness', (req, res) => res.status(200).end());
    server.get('/health/readiness', async (req, res) => {
      const dbReady = await healthCheck.isReady();

      if (!dbReady) return res.status(500).end();
      return res.status(200).json({ status: 'ready' });
    });

    // Catch all requests
    server.get('*', (req, res) => {
      return handle(req, res);
    });

    const serverInstance = server.listen(port, () => {
      logger.info(
        {
          host,
          port,
          env: process.env.NODE_ENV || 'development',
        },
        `Server has been started @ ${host}:${port}`
      );
    });

    process.on('SIGTERM', () => {
      logger.info('SERVER: Server shutting down');
      healthCheck.setShuttingDown();

      serverInstance.close(err => {
        if (err) {
          logger.error({ err }, 'SERVER: Error closing server');
          process.exit(1);
        }

        logger.info('SERVER: Server closed');
        process.exit(0);
      });
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        logger.info('Server address in use, retrying to start...');

        setTimeout(() => {
          serverInstance.close();
          server.listen(port, () => {
            logger.info(
              {
                host,
                port,
                env: process.env.NODE_ENV || 'development',
              },
              `Server has been started @ ${host}:${port}`
            );
          });
        }, 1000);
      }

      throw err;
    });
  })
  .catch(err => {
    logger.error({ err }, 'Next.js failed to start');
    process.exit(1);
  });
