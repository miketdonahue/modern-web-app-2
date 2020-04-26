const { colors, fontFamily, boxShadow } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    screens: {
      '360': '360px',
      '480': '480px',
      '600': '600px',
      '768': '768px',
      '1024': '1024px',
      '1280': '1280px',
      '1440': '1440px',
      '1600': '1600px',
    },
    // Set colors from default without unwanted colors included
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      red: colors.red,
      blue: colors.blue,
      orange: colors.orange,
      yellow: colors.yellow,
      green: colors.green,
    },
    boxShadow: {
      ...boxShadow,
      outline: '0 0 0 2px rgba(56, 161, 105, 0.5)',
    },
    extend: {
      // Override default colors or extend colors
      colors: {
        // Font
        text: colors.gray[700],
        link: colors.green[600],

        // Contextual
        error: '',
        warning: '',
        success: '',
        info: '',
      },
      fontFamily: {
        // Add application custom font
        sans: ['Heebo', ...fontFamily.sans],
      },
    },
  },
  variants: {},
  plugins: [],
};
