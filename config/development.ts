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
        confirmable: true,
        lockable: {
          enabled: true,
        },
      },
      mailer: {
        sendEmails: false,
      },
      contentSecurityPolicy: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'cdn.jsdelivr.net',
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'cdn.jsdelivr.net',
          'fonts.googleapis.com',
        ],
        fontSrc: ["'self'", 'data:', 'fonts.gstatic.com'],
        imgSrc: [
          "'self'",
          'data:',
          'cdn.jsdelivr.net',
          'graphcool-playground.netlify.com',
        ],
        connectSrc: ["'self'", 'devtools.apollodata.com'],
      },
      dirs: {
        routes: ['src/views/**/routes.ts', 'src/server/api/**/*.ts'],
      },
    },
  },
  { arrayMerge: (destinationArray, sourceArray, options) => sourceArray }
);
