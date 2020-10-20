import React from 'react';
import { Icon } from '../typings';

const ShoppingBag = ({ size = 96, ...restOfProps }: Icon) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 180 180"
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
        d="M143.509 34.0439H36.4688V46.4321H143.509V34.0439Z"
        fill="#324A5E"
      />
      <path
        d="M34 129.379V141.283C34 143.862 36.0941 145.956 38.6731 145.956H141.327C143.906 145.956 146 143.862 146 141.283V129.379H34Z"
        fill="#ECB85E"
      />
      <path d="M145.978 46.4321H34V129.38H145.978V46.4321Z" fill="#F6E080" />
      <path d="M34 46.432H49.2096V37.8794L34 46.432Z" fill="#395369" />
      <path
        d="M49.2096 37.8794L36.4688 34.0439V45.0213L49.2096 37.8794Z"
        fill="#F6E080"
      />
      <path
        d="M145.978 46.432H130.768V37.8794L145.978 46.432Z"
        fill="#395369"
      />
      <path
        d="M130.768 37.8794L143.509 34.0439V45.0213L130.768 37.8794Z"
        fill="#F6E080"
      />
      <path
        d="M68.0122 71.3847C70.4592 71.3847 72.4428 69.401 72.4428 66.9541C72.4428 64.5071 70.4592 62.5234 68.0122 62.5234C65.5652 62.5234 63.5816 64.5071 63.5816 66.9541C63.5816 69.401 65.5652 71.3847 68.0122 71.3847Z"
        fill="#324A5E"
      />
      <path
        d="M111.966 71.3847C114.413 71.3847 116.396 69.401 116.396 66.9541C116.396 64.5071 114.413 62.5234 111.966 62.5234C109.519 62.5234 107.535 64.5071 107.535 66.9541C107.535 69.401 109.519 71.3847 111.966 71.3847Z"
        fill="#324A5E"
      />
      <path
        d="M117.036 89.3716C116.97 93.0527 116.132 96.7339 114.523 100.261C110.048 109.938 100.658 115.955 89.989 115.955C79.3202 115.955 69.9299 109.938 65.4552 100.261C63.824 96.7339 63.0085 93.0527 62.9423 89.3716H59.195C59.2612 93.5818 60.209 97.792 62.0606 101.826C67.1525 112.847 77.8433 119.681 89.989 119.681C102.135 119.681 112.825 112.825 117.917 101.826C119.769 97.814 120.717 93.5818 120.783 89.3716H117.036Z"
        fill="#ECB85E"
      />
      <path
        d="M89.989 117.212C77.8433 117.212 67.1525 110.357 62.0606 99.3574C56.9687 88.358 58.7101 75.7494 66.5794 66.5135C67.2407 65.7199 68.431 65.6318 69.2025 66.293C69.9961 66.9543 70.0842 68.1446 69.423 68.9161C62.5015 77.0279 60.9805 88.0935 65.4552 97.7703C69.9299 107.447 79.3202 113.465 89.989 113.465C100.658 113.465 110.048 107.447 114.523 97.7703C118.997 88.0935 117.476 77.0279 110.555 68.9161C109.894 68.1226 109.982 66.9543 110.775 66.293C111.569 65.6318 112.737 65.7199 113.399 66.5135C121.268 75.7494 123.009 88.3359 117.917 99.3574C112.825 110.357 102.135 117.212 89.989 117.212Z"
        fill="#F2F2F2"
      />
    </svg>
  );
};

export { ShoppingBag };