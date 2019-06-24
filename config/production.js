const merge = require('deepmerge');
const defaultConfig = require('./default');

module.exports = merge(defaultConfig, {
  server: {
    host: 'http://localhost',
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
  },
});
