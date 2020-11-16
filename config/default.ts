export default {
  server: {
    domain: 'http://localhost:8080',
    port: process.env.PORT || 8080,
    middleware: {
      helmet: {
        referrerPolicy: {
          policy: 'strict-origin-when-cross-origin',
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
      confirmable: false,
      lockable: {
        enabled: true,
        maxAttempts: 5,
      },
      cookieExpiresIn: '14', // time in days
      jwt: {
        expiresIn: '15m',
        refreshExpiresIn: '7d',
        tokenNames: {
          payload: 'token-payload',
          signature: 'token-signature',
          refresh: 'token-refresh',
        },
      },
      codes: {
        expireTime: 30, // time in minutes
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
      routes: [
        '.build/src/views/**/routes.js',
        '.build/src/server/api/**/*.js',
      ],
      specialRoutes: ['.build/src/server/api/webhooks/**/*.js'],
    },
  },
};
