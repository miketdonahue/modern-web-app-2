import React from 'react';
import { Icon } from '../typings';

const Plus = ({ color = 'currentColor', size = 24, ...restOfProps }: Icon) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke={color}
    strokeWidth="0"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...restOfProps}
  >
    <path
      id="icon"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 11H22V13H13V22H11V13H2V11H11V2H13V11Z"
      fill={color}
    />
  </svg>
);

export { Plus };
