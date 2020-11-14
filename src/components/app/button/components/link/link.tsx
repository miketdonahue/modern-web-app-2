import React from 'react';
import cx from 'classnames';
import styles from './link.module.scss';

export interface LinkProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Link = ({ children, ...restOfProps }: LinkProps) => {
  return (
    <button
      type="button"
      onClick={restOfProps.onClick}
      className={cx(styles.link, restOfProps.className)}
      {...restOfProps}
    >
      {children}
    </button>
  );
};
