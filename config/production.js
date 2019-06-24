const merge = require('deepmerge');
const defaultConfig = require('./default');

module.exports = merge(defaultConfig, {
  server: {
    host: 'http://localhost',
  },
});
