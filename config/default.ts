export default {
  client: {
    dirs: {
      types: 'pages/**/types/*.graphql',
      resolvers: 'pages/**/resolvers/*.ts',
    },
  },
  server: {
    port: process.env.PORT || 8080,
    graphql: {
      path: '/graphql',
      playground: false,
      debug: false,
      logger: false,
    },
    auth: {
      enabled: true,
      confirmable: true,
      jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '30m',
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
      types: '.build/server/models/**/types/*.graphql',
      resolvers: '.build/server/models/**/resolvers/*.js',
      routes: '.build/server/pages/**/routes.js',
      access: '.build/server/models/**/access.js',
      validations: '.build/server/models/**/validations.js',
    },
  },
};
