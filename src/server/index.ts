import 'reflect-metadata';
import express from 'express';
import nextServer from 'next';
import { createConnection } from 'typeorm';
import { HealthCheck } from '@server/modules/health-check';
import { logger } from '@server/modules/logger';
import { fileLoader } from '@utils/file-loader';
import { requestLogger } from '@server/middleware/app-middleware';
import { config } from '@config';
import { coreMiddleware } from '@server/middleware/core-middleware';
import { registerRoutes } from './plugins/register-routes';
import { registerMiddleware } from './plugins/register-middleware';

const isDev = process.env.NODE_ENV !== 'production';
const dbConnectionName = isDev ? 'development' : 'production';
const healthCheck = new HealthCheck();
const nextApp = nextServer({ dev: isDev });
const handle = nextApp.getRequestHandler();

// Register types and resolvers
const routes = fileLoader('routes', { flatten: true });
const specialRoutes = fileLoader('specialRoutes', { flatten: true });

nextApp
  .prepare()
  .then(async () => {
    const expressApp = express();
    const { host, port } = config.server;

    // Create database connection
    await createConnection(dbConnectionName);

    // Trusting proxy must be set for load balancing
    expressApp.set('trust proxy', true);

    // Routes needing special treatment (i.e. webhooks)
    await registerRoutes(expressApp, nextApp, specialRoutes);

    // Register plugins
    await registerMiddleware(expressApp, [...coreMiddleware, requestLogger]);
    await registerRoutes(expressApp, nextApp, routes);

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

      serverInstance.close((err) => {
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
  .catch((err) => {
    logger.error({ err }, 'Next.js failed to start');
    process.exit(1);
  });
