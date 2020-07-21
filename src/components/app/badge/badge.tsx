import React from 'react';
import cx from 'classnames';
import styles from './badge.module.scss';

interface Badge extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
}

const Badge = ({ count, className, ...restOfProps }: Badge) => {
  return (
    <div className={cx(styles.badge, className)} {...restOfProps}>
      {count}
    </div>
  );
};

export { Badge };
