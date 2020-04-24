import React from 'react';
import styles from './checkbox.module.scss';

interface Checkbox
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  disabled?: boolean;
}

const Checkbox = ({ disabled = false, ...restOfProps }: Checkbox) => {
  return (
    <input
      {...restOfProps}
      type="checkbox"
      className={styles.checkbox}
      disabled={disabled}
    />
  );
};

export { Checkbox };
