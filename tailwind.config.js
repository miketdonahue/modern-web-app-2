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
    spacing: {
      px: '1px',
      '0': '0',
      '1': '0.25em',
      '2': '0.5em',
      '3': '0.75em',
      '4': '1em',
      '5': '1.25em',
      '6': '1.5em',
      '8': '2em',
      '10': '2.5em',
      '12': '3em',
      '16': '4em',
      '20': '5em',
      '24': '6em',
      '32': '8em',
      '40': '10em',
      '48': '12em',
      '56': '14em',
      '64': '16em',
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
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'visited'],
  },
  plugins: [],
  purge: ['./src/components/**/*.tsx', './src/views/**/*.tsx'],
};
