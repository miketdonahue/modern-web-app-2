import React from 'react';
import { Icon } from '../typings';

const Email = ({ color = 'currentColor', size = 96, ...restOfProps }: Icon) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill={color}
      stroke={color}
      strokeWidth="0"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...restOfProps}
    >
      <path
        d="M90 180C139.706 180 180 139.706 180 90C180 40.2944 139.706 0 90 0C40.2944 0 0 40.2944 0 90C0 139.706 40.2944 180 90 180Z"
        fill="#EDF2F7"
      />
      <path
        d="M157.603 57.559L95.1323 12.2407C92.8686 10.5864 89.7777 10.5864 87.4705 12.2407L25.0871 57.559L91.3449 99.7429L157.603 57.559Z"
        fill="#ECB85E"
      />
      <path d="M132.136 57.559H50.5541V128.301H132.136V57.559Z" fill="white" />
      <path
        d="M157.559 141.883H157.603V57.559L91.345 99.7429L157.559 141.883Z"
        fill="#F3BF64"
      />
      <path
        d="M25.0871 57.559H25V141.883H25.1306L91.345 99.7429L25.0871 57.559Z"
        fill="#F3BF64"
      />
      <path
        d="M91.3449 99.7429L25.1306 141.883H157.559L91.3449 99.7429Z"
        fill="#ECB85E"
      />
    </svg>
  );
};

export { Email };
