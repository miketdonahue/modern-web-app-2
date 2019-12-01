/* eslint-disable @typescript-eslint/no-var-requires */
const { theme } = require('../../tailwind.config');

module.exports = {
  // Colors
  '@primary-color': theme.colors.primary,
  '@info-color': theme.colors.blue[600],
  '@success-color': theme.colors.green[600],
  '@processing-color': theme.colors.primary,
  '@error-color': theme.colors.red[600],
  '@highlight-color': theme.colors.red[600],
  '@warning-color': theme.colors.yellow[600],
  '@normal-color': theme.colors.gray[600],
  '@white': theme.colors.white,
  '@black': theme.colors.black,

  // Component
  '@component-background': theme.colors.white,
  '@checkbox-size': '16px',
  '@radio-size': '16px',

  // Font
  '@font-family': theme.fontFamily.sans,
  '@font-size-base': theme.fontSize.base,
  '@font-size-lg': theme.fontSize.xl,
  '@font-size-sm': theme.fontSize.xs,
  '@line-height-base': theme.lineHeight.normal,

  // Text
  '@text-color': theme.colors.black,
  '@text-color-secondary': theme.colors.gray[500],
  '@text-color-inverse': theme.colors.white,
  '@text-color-dark': theme.colors.gray[800],
  '@text-color-secondary-dark': theme.colors.gray[600],

  // Border radius
  '@border-radius-base': theme.borderRadius.default,
  '@border-radius-sm': theme.borderRadius.sm,

  // Links
  '@link-decoration': 'none',
  '@link-hover-decoration': 'underline',
};
