import React from 'react';
import { useDropdownToggle } from 'react-overlays';

type ToggleProps = {
  id: string;
  children: React.ReactNode;
};

export const Toggle = ({ id, children }: ToggleProps) => {
  const [props, { toggle }] = useDropdownToggle();

  return (
    <button id={id} type="button" {...props} onClick={toggle as any}>
      {children}
    </button>
  );
};
