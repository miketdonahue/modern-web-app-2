import React from 'react';
import cx from 'classnames';
import { ModalContext } from '../../modal-context';
import styles from './header.module.scss';

const Header = ({ className, children }: any) => (
  <ModalContext.Consumer>
    {() => <div className={cx(styles.header, className)}>{children}</div>}
  </ModalContext.Consumer>
);

export { Header };
