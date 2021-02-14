import React from 'react';
import { Icon } from '../typings';

const EyeOpen = ({
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
      d="m12 4c2.7276 0 5.3357 1.4306 7.7663 3.7812 0.8292 0.8019 1.5794 1.658 2.2398 2.5144 0.3985 0.5168 0.6814 0.9234 0.8364 1.1656l0.3446 0.5388-0.3446 0.5388c-0.155 0.2422-0.4379 0.6488-0.8364 1.1656-0.6604 0.8564-1.4106 1.7126-2.2398 2.5145-2.4306 2.3505-5.0387 3.7811-7.7663 3.7811-2.7275 0-5.3357-1.4306-7.7663-3.7811-0.82922-0.8019-1.5794-1.6581-2.2398-2.5145-0.3985-0.5168-0.68143-0.9234-0.83634-1.1656l-0.3446-0.5388 0.3446-0.5388c0.15491-0.2422 0.43784-0.6488 0.83634-1.1656 0.6604-0.85644 1.4106-1.7126 2.2398-2.5144 2.4306-2.3505 5.0387-3.7812 7.7663-3.7812zm8.4223 7.5169c-0.6047-0.7842-1.2921-1.5687-2.0463-2.298-2.0935-2.0245-4.2709-3.2188-6.376-3.2188-2.105 0-4.2825 1.1944-6.3759 3.2188-0.7542 0.72935-1.4416 1.5138-2.0463 2.298-0.13059 0.1693-0.25126 0.3309-0.36158 0.4831 0.11032 0.1522 0.23099 0.3138 0.36158 0.4831 0.60464 0.7842 1.2921 1.5687 2.0463 2.298 2.0934 2.0245 4.2709 3.2189 6.3759 3.2189 2.1051 0 4.2825-1.1944 6.376-3.2189 0.7542-0.7293 1.4416-1.5138 2.0463-2.298 0.1306-0.1693 0.2512-0.3309 0.3616-0.4831-0.1104-0.1522-0.231-0.3138-0.3616-0.4831zm-12.422 0.4831c0 2.2091 1.7909 4 4 4 2.2092 0 4-1.7909 4-4 0-2.2091-1.7908-4-4-4-2.2091 0-4 1.7909-4 4zm6 0c0 1.1046-0.8954 2-2 2-1.1045 0-2-0.8954-2-2s0.8955-2 2-2c1.1046 0 2 0.8954 2 2z"
      clipRule="evenodd"
      fillRule="evenodd"
    />
  </svg>
);

export { EyeOpen };
