/* eslint-disable @typescript-eslint/no-var-requires */
const { theme } = require('../../tailwind.config');

/**
 * Sizes must be in pixels
 * Ant internally adds and subtracts values an expects pixels
 */
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
  '@font-size-base': '16px',
  '@font-size-lg': '18px',
  '@font-size-sm': '14px',
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
  '@link-color': theme.colors.link,
  '@link-decoration': 'none',
  '@link-hover-decoration': 'underline',

  // Button
  '@btn-font-size-sm': '14px',
  '@btn-font-size-lg': '18px',
  '@btn-height-base': '32px',
  '@btn-height-lg': '42px',
  '@btn-height-sm': '24px',
  '@btn-text-shadow': 'none',
  '@btn-font-weight': 500,

  // Breadcrumb
  '@breadcrumb-link-color': theme.colors.gray[600],
  '@breadcrumb-link-color-hover': theme.colors.link,

  // Input
  '@input-height-base': '34px',
  '@input-height-lg': '42px',
  '@input-height-sm': '26px',

  // Avatar
  '@avatar-bg': theme.colors.gray[300],

  // Table
  '@table-row-hover-bg': theme.colors.gray[100],

  // List
  '@list-item-meta-title-margin-bottom': '0px',

  // Timeline
  '@timeline-color': theme.colors.gray[300],

  // Comment
  '@comment-font-size-base': '16px',
  '@comment-font-size-sm': '14px',
  '@comment-padding-base': '12px 0',
  '@comment-author-name-color': theme.colors.gray[700],
  '@comment-author-time-color': theme.colors.gray[500],
  '@comment-action-color': theme.colors.gray[600],
  '@comment-action-hover-color': theme.colors.gray[800],
};
