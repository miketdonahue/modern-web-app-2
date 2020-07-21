import React from 'react';
import cx from 'classnames';
import { ShoppingCart as Icon } from '@components/icons';
import styles from './shopping-cart.module.scss';

interface ShoppingCart extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  size?: number;
}

const ShoppingCart = ({
  count,
  size = 30,
  className,
  ...restOfProps
}: ShoppingCart) => {
  return (
    <div className="relative">
      <div
        className={cx(styles.badge, className)}
        style={{ fontSize: size / 3 + 4 }}
        {...restOfProps}
      >
        {count}
      </div>
      <Icon size={size} />
    </div>
  );
};

export { ShoppingCart };
