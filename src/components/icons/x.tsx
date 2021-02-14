import React from 'react';
import { Icon } from '../typings';

const X = ({ color = 'currentColor', size = 24, ...restOfProps }: Icon) => (
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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.06 13.8095L6.74946 19.12L5 17.3705L10.3105 12.06L5 6.74946L6.74946 5L12.06 10.3105L17.3705 5L19.12 6.74946L13.8095 12.06L19.12 17.3705L17.3705 19.12L12.06 13.8095Z"
      fill={color}
    />
  </svg>
);

export { X };
