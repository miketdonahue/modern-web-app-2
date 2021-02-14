import React from 'react';
import { Icon } from '../../typings';

const Google = ({ color, size = 24, ...restOfProps }: Icon) => (
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
      d="M12 5.86667C13.8778 5.86667 15.1444 6.67778 15.8667 7.35556L18.6889 4.6C16.9555 2.98889 14.7 2 12 2C8.08887 2 4.71109 4.24444 3.06665 7.51111L6.29998 10.0222C7.11109 7.61111 9.35554 5.86667 12 5.86667V5.86667Z"
      fill={color || '#EA4335'}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.6 12.2222C21.6 11.4 21.5333 10.8 21.3889 10.1778H12V13.8889H17.5111C17.4 14.8111 16.8 16.2 15.4667 17.1333L18.6222 19.5778C20.5111 17.8333 21.6 15.2667 21.6 12.2222V12.2222Z"
      fill={color || '#4285F4'}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.31111 13.9778C6.1 13.3556 5.97778 12.6889 5.97778 12C5.97778 11.3111 6.1 10.6444 6.3 10.0222L3.06667 7.51111C2.38889 8.86666 2 10.3889 2 12C2 13.6111 2.38889 15.1333 3.06667 16.4889L6.31111 13.9778V13.9778Z"
      fill={color || '#FBBC05'}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.0001 22C14.7001 22 16.9668 21.1111 18.6223 19.5778L15.4668 17.1333C14.6223 17.7222 13.489 18.1333 12.0001 18.1333C9.35566 18.1333 7.11121 16.3889 6.31121 13.9778L3.07788 16.4889C4.72233 19.7555 8.08899 22 12.0001 22V22Z"
      fill={color || '#34A853'}
    />
  </svg>
);

export { Google };
