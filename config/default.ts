export default {
  server: {
    port: process.env.PORT || 8080,
    middleware: {
      helmet: {
        referrerPolicy: {
          policy: 'same-origin',
        },
      },
      cors: {
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
      },
      cookieParser: {},
      bodyParser: {
        urlEncoded: { extended: false },
        json: {},
      },
      csrf: { cookie: { key: '_ds_csrf', sameSite: true } },
    },
    graphql: {
      path: '/graphql',
      playground: {
        enabled: false,
        endpoint: '/playground',
      },
      debug: false,
      logger: false,
    },
    auth: {
      enabled: true,
      confirmable: true,
      cookieExpiresIn: '14', // time in days
      jwt: {
        secret: process.env.JWT_SECRET,
        dsSecret: process.env.JWT_DS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '15m',
        refreshExpiresIn: '7d',
      },
      codes: {
        // time in minutes
        expireTime: {
          passwordReset: 30,
          locked: 15,
        },
      },
      lockable: {
        enabled: true,
        maxAttempts: 5,
      },
      securityQuestions: {
        number: 3,
      },
    },
    mailer: {
      sendEmails: true,
    },
    logger: {
      enabled: true,
      level: 'info',
      pretty: false,
    },
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
    },
    dirs: {
      types: ['.build/src/server/graphql/**/types/*.gql'],
      resolvers: ['.build/src/server/graphql/**/resolvers/*.js'],
      routes: ['.build/src/views/**/routes.js'],
      access: ['.build/src/server/graphql/**/access.js'],
      validations: ['.build/src/server/graphql/**/validations.js'],
    },
  },
};
