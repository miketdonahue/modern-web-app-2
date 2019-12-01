/* eslint-disable global-require */
const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./server/pages/**/*.tsx'],
  whitelistPatterns: [/ant/], // ignore ant design classes

  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
  // Order matters for plugins
  plugins: [
    require('postcss-import')({
      plugins: [
        require('stylelint')({
          configFile: './stylelint.config.js',
        }),
      ],
    }),
    require('tailwindcss'),
    require('postcss-simple-vars'),
    require('postcss-functions'),
    require('postcss-mixins'),
    require('postcss-preset-env')({
      stage: 3,
      features: { 'nesting-rules': true, 'custom-properties': true },
    }),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
    require('postcss-reporter')({ clearReportedMessages: true }),
  ],
};
