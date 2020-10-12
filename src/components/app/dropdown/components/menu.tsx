import React from 'react';
import { useDropdownMenu } from 'react-overlays';

interface Menu extends React.HTMLAttributes<HTMLDivElement> {
  role?: 'menu' | 'list';
  children: React.ReactNode;
}

export const Menu = ({ role = 'menu', children, ...restOfProps }: Menu) => {
  const { props } = useDropdownMenu();

  return (
    <div role={role} {...props} {...restOfProps}>
      {children}
    </div>
  );
};
