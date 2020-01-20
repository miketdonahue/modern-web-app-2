import 'reflect-metadata';
import express from 'express';
import nextServer from 'next';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { createConnection, getConnection } from 'typeorm';
import { prisma } from '@server/prisma/generated/prisma-client';
import { normalizeError } from '@server/modules/errors';
import { HealthCheck } from '@server/modules/health-check';
import logger from '@server/modules/logger';
import { fileLoader } from '@utils/file-loaders/node';
import { mergeResolvers } from '@utils/merge-resolvers/server';
import { mailer } from '@server/modules/mailer';
import {
  access,
  authenticate,
  validations,
  requestLogger,
  resolverLogger,
} from '@server/middleware';
import config from '@config';
import { registerRoutes } from './plugins/register-routes';

const isDev = process.env.NODE_ENV !== 'production';
const dbConnectionName = isDev ? 'development' : 'production';
const healthCheck = new HealthCheck();
const nextApp = nextServer({ dev: isDev });
const handle = nextApp.getRequestHandler();

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

nextApp
  .prepare()
  .then(async () => {
    const expressApp = express();
    const { host, port } = config.server;

    // Create database connection
    await createConnection(dbConnectionName);
    const db = getConnection(dbConnectionName);

    const apollo = new ApolloServer({
      schema,
      context: async ({ req, res }) => {
        return {
          req,
          res,
          actor: authenticate(req.headers),
          prisma,
          db: db.manager,
          mailer,
        };
      },
      playground: config.server.graphql.playground.enabled,
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

    expressApp.set('trust proxy', true);
    expressApp.use(
      cors({
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );
    expressApp.use(helmet());
    expressApp.use(helmet.referrerPolicy({ policy: 'same-origin' }));
    expressApp.use(requestLogger());
    expressApp.use(cookieParser());
    expressApp.use(
      helmet.contentSecurityPolicy({
        directives: config.server.contentSecurityPolicy,
      })
    );
    expressApp.use(bodyParser.urlencoded({ extended: false }));
    expressApp.use((req, res, next) => {
      if (
        req.path ===
        `${config.server.graphql.path}${config.server.graphql.playground.endpoint}`
      ) {
        next();
      }

      csrf({ cookie: { key: 'ds_csrf' } })(req, res, next);
    });

    // Register plugins
    await registerRoutes(expressApp, nextApp, routes);

    // Apply Express middleware to GraphQL server
    apollo.applyMiddleware({
      app: expressApp,
      path: config.server.graphql.path,
      cors: {
        origin: 'same-origin',
        credentials: true,
        optionsSuccessStatus: 200,
      },
      bodyParserConfig: true,
    });

    // Health & graceful shutdown
    expressApp.get('/health/liveness', (req, res) => res.status(200).end());
    expressApp.get('/health/readiness', async (req, res) => {
      const dbReady = await healthCheck.isReady();

      if (!dbReady) return res.status(500).end();
      return res.status(200).json({ status: 'ready' });
    });

    // Catch all requests
    expressApp.get('*', (req, res) => {
      return handle(req, res);
    });

    const serverInstance = expressApp.listen(port, () => {
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

    expressApp.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        logger.info('Server address in use, retrying to start...');

        setTimeout(() => {
          serverInstance.close();
          expressApp.listen(port, () => {
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
