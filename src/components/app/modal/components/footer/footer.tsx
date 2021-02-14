import React from 'react';
import cx from 'classnames';
import { ModalContext } from '../../modal-context';
import styles from './footer.module.scss';

const Footer = ({ className, children }: any) => (
  <ModalContext.Consumer>
    {() => <div className={cx(styles.footer, className)}>{children}</div>}
  </ModalContext.Consumer>
);

export { Footer };
