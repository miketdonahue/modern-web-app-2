import React from 'react';
import cx from 'classnames';
import { ShoppingCart as Icon } from '@components/icons';
import styles from './cart.module.scss';

interface Cart extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  size?: number;
}

const Cart = ({ count, size = 30, className, ...restOfProps }: Cart) => {
  return (
    <div className="relative cursor-pointer" {...restOfProps}>
      <div
        className={cx(styles.badge, className)}
        style={{ fontSize: size / 3 + 4 }}
      >
        {count}
      </div>
      <Icon size={size} />
    </div>
  );
};

export { Cart };
