/* eslint-disable react/button-has-type */
import React from 'react';
import cx from 'classnames';
import styles from './input.module.scss';

interface Input extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'password' | 'hidden';
  error?: boolean;
  disabled?: boolean;
}

const Input = ({
  type = 'text',
  error = false,
  disabled = false,
  ...restOfProps
}: Input) => {
  const inputClasses = cx(styles.input, { [styles.error]: error });

  return (
    <input
      {...restOfProps}
      type={type}
      className={inputClasses}
      disabled={disabled}
    />
  );
};

export { Input };
