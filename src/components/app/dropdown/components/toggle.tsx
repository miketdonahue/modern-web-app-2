import React from 'react';
import { useDropdownToggle } from 'react-overlays';

type Toggle = {
  id: string;
  children: React.ReactNode;
};

export const Toggle = ({ id, children }: Toggle) => {
  const [props, { toggle }] = useDropdownToggle();

  return (
    <button id={id} type="button" {...props} onClick={toggle as any}>
      {children}
    </button>
  );
};
