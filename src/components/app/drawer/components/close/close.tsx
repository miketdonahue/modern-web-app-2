import React from 'react';
import { X } from '@components/icons';
import { DrawerContext } from '../../drawer-context';

interface Close extends React.HTMLAttributes<HTMLButtonElement> {}

export const Close = ({ ...restOfProps }: Close) => {
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
