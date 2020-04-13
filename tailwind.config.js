const { colors, fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    screens: {
      'p-md': '360px',
      'p-lg': '480px',
      't-sm': '600px',
      't-md': '768px',
      't-lg': '1024px',
      'd-sm': '1280px',
      'd-md': '1440px',
    },
    // Set colors from default without unwanted colors included
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      red: colors.red,
      orange: colors.orange,
      yellow: colors.yellow,
      green: colors.green,
    },
    extend: {
      // Override default colors or extend colors
      colors: {
        // Brand
        primary: '',
        secondary: '',
        highlight: '',

        // Font
        text: '#333333',
        link: 'blue',

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
