import React from 'react';
import { Icon } from '../typings';

const Email = ({ size = 96, ...restOfProps }: Icon) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 144 144"
    strokeWidth="0"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...restOfProps}
  >
    <path
      d="M72 144C111.765 144 144 111.765 144 72C144 32.2355 111.765 0 72 0C32.2355 0 0 32.2355 0 72C0 111.765 32.2355 144 72 144Z"
      fill="#EDF2F7"
    />
    <path
      d="M112.057 60.4581L73.8734 32.7584C72.4897 31.7472 70.6005 31.7472 69.1903 32.7584L31.0598 60.4581L71.5584 86.2421L112.057 60.4581Z"
      fill="#ECB85E"
    />
    <path d="M96.4842 60.4585H46.6193V103.698H96.4842V60.4585Z" fill="white" />
    <path
      d="M112.024 112H112.05V60.4585L71.5516 86.2424L112.024 112Z"
      fill="#F3BF64"
    />
    <path
      d="M31.0532 60.4585H31V112H31.0798L71.5519 86.2424L31.0532 60.4585Z"
      fill="#F3BF64"
    />
    <path
      d="M71.5521 86.2424L31.0801 112H112.024L71.5521 86.2424Z"
      fill="#ECB85E"
    />
  </svg>
);

export { Email };
