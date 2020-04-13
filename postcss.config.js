module.exports = {
  plugins: [
    [
      'postcss-preset-env',
      {
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
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
          },
        ]
      : undefined,
  ],
};
