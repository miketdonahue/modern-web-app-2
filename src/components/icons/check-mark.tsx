import React from 'react';
import { Icon } from './typings';

const CheckMark = ({
  color = 'currentColor',
  size = 24,
  ...restOfProps
}: Icon) => {
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
        d="M9.70711 14.2929L19 5L20.4142 6.41421L9.70711 17.1213L4 11.4142L5.41421 10L9.70711 14.2929Z"
        clipRule="evenodd"
        fillRule="evenodd"
      />
    </svg>
  );
};

export { CheckMark };
