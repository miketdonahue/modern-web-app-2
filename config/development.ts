import merge from 'lodash.merge';
import defaultConfig from './default';

export default merge(defaultConfig, {
  server: {
    host: 'http://localhost',
    logger: {
      level: 'debug',
      pretty: true,
    },
    graphql: {
      playground: {
        enabled: true,
      },
      debug: true,
      logger: true,
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
      types: ['src/server/graphql/**/types/*.gql'],
      resolvers: ['src/server/graphql/**/resolvers/*.ts'],
      routes: ['src/views/**/routes.ts', 'src/server/api/**/*.ts'],
      access: ['src/server/graphql/**/access.ts'],
      validations: ['src/server/graphql/**/validations.ts'],
    },
  },
});
