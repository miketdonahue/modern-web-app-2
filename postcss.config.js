module.exports = {
  // Order matters for plugins
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    'postcss-preset-env': { stage: 3 }, // Includes: autoprefixer, nesting, custom-properties
    'postcss-simple-vars': {},
    'postcss-functions': {},
    'postcss-mixins': {},
  },
};
