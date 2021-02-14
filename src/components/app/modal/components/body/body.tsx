import React from 'react';
import cx from 'classnames';
import { ModalContext } from '../../modal-context';
import styles from './body.module.scss';

const Body = ({ className, children }: any) => (
  <ModalContext.Consumer>
    {() => <div className={cx(styles.body, className)}>{children}</div>}
  </ModalContext.Consumer>
);

export { Body };
