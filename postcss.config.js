// Default Next.js PostCSS config extended
module.exports = {
  plugins: [
    'postcss-simple-vars',
    'postcss-nested',
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
      },
    ],
    'tailwindcss',
    process.env.NODE_ENV === 'production'
      ? [
          '@fullhuman/postcss-purgecss',
          {
            content: [
              './src/pages/**/*.{ts,tsx}',
              './src/views/**/*.{ts,tsx}',
              './src/components/**/*.{ts,tsx}',
            ],
            defaultExtractor: (content) =>
              content.match(/[\w-/:]+(?<!:)/g) || [],
          },
        ]
      : undefined,
  ],
};
