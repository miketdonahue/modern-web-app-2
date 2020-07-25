import React from 'react';
import { ModalContext } from '../../modal-context';

const Close = ({ children }: any) => {
  return (
    <ModalContext.Consumer>
      {({ closeModal }) => {
        return (
          <button type="button" onClick={closeModal}>
            {children}
          </button>
        );
      }}
    </ModalContext.Consumer>
  );
};

export { Close };
