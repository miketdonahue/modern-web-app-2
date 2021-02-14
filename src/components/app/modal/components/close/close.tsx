import React from 'react';
import { ModalContext } from '../../modal-context';

const Close = ({ children }: any) => (
  <ModalContext.Consumer>
    {({ closeModal }) => (
      <button type="button" onClick={closeModal}>
        {children}
      </button>
    )}
  </ModalContext.Consumer>
);

export { Close };
