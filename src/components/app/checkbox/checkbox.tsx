import React from 'react';
import cx from 'classnames';
import styles from './checkbox.module.scss';

interface Checkbox extends React.InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
}

const Checkbox = ({
  disabled = false,
  className,
  ...restOfProps
}: Checkbox) => {
  return (
    <input
      type="checkbox"
      className={cx(styles.checkbox, className)}
      disabled={disabled}
      {...restOfProps}
    />
  );
};

export { Checkbox };
