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
        expireTime: 30,
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
      routes: ['.build/src/views/**/routes.js'],
    },
  },
};
