import merge from 'deepmerge';
import defaultConfig from './default';

export default merge(
  defaultConfig,
  {
    server: {
      host: 'http://localhost',
      logger: {
        level: 'debug',
        pretty: true,
      },
      auth: {
        enabled: true,
        confirmable: false,
        lockable: {
          enabled: true,
        },
      },
      mailer: {
        sendEmails: false,
      },
      contentSecurityPolicy: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
        fontSrc: ["'self'", 'data:', 'fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'rickandmortyapi.com'],
        connectSrc: ["'self'"],
      },
      dirs: {
        routes: ['src/views/**/routes.ts', 'src/server/api/**/*.ts'],
      },
    },
  },
  { arrayMerge: (destinationArray, sourceArray, options) => sourceArray }
);
