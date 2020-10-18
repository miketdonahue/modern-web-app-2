import React from 'react';
import { Icon } from '../typings';

const Minus = ({ color = 'currentColor', size = 24, ...restOfProps }: Icon) => {
  return (
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
        d="M22 11V13H2V11H22Z"
        fill={color}
      />
    </svg>
  );
};

export { Minus };
