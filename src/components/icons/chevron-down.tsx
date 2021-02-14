import React from 'react';
import { Icon } from '../typings';

const ChevronDown = ({
  color = 'currentColor',
  size = 24,
  ...restOfProps
}: Icon) => (
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
      d="M19.293 7.29291L20.7072 8.70712L12.0001 17.4142L3.29297 8.70712L4.70718 7.29291L12.0001 14.5858L19.293 7.29291Z"
    />
  </svg>
);

export { ChevronDown };
