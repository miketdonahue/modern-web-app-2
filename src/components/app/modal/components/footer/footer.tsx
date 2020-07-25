import React from 'react';
import { ModalContext } from '../../modal-context';

const Footer = ({ children }: any) => {
  return (
    <ModalContext.Consumer>
      {() => {
        return (
          <div>
            <div>{children}</div>
          </div>
        );
      }}
    </ModalContext.Consumer>
  );
};

export { Footer };
