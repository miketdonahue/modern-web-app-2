import React from 'react';
import { useDropdownMenu } from 'react-overlays';

interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: 'menu' | 'list';
  children: React.ReactNode;
}

export const Menu = ({
  role = 'menu',
  children,
  ...restOfProps
}: MenuProps) => {
  const { props } = useDropdownMenu();

  return (
    <div role={role} {...props} {...restOfProps}>
      {children}
    </div>
  );
};
