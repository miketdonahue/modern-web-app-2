import React from 'react';
import { X } from '@components/icons';
import { DrawerContext } from '../../drawer-context';

interface CloseProps extends React.HTMLAttributes<HTMLButtonElement> {}

export const Close = ({ ...restOfProps }: CloseProps) => {
  return (
    <DrawerContext.Consumer>
      {({ onClose }) => {
        return (
          <button type="button" onClick={onClose} {...restOfProps}>
            <X />
          </button>
        );
      }}
    </DrawerContext.Consumer>
  );
};
