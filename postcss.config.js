module.exports = {
  // Order matters for plugins
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    'postcss-simple-vars': {},
    'postcss-functions': {},
    'postcss-mixins': {},
    'postcss-preset-env': {
      stage: 3,
      features: { 'nesting-rules': true, 'custom-properties': true },
    },
  },
};
