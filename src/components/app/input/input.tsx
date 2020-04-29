/* eslint-disable react/button-has-type */
import React from 'react';
import cx from 'classnames';
import { Password } from './components/password';
import styles from './input.module.scss';

interface Input extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'hidden';
  error?: boolean;
  disabled?: boolean;
}

const Input = ({
  type = 'text',
  error = false,
  disabled = false,
  className,
  ...restOfProps
}: Input) => {
  const inputClasses = cx(styles.input, { [styles.error]: error }, className);

  return (
    <input
      type={type}
      className={inputClasses}
      disabled={disabled}
      {...restOfProps}
    />
  );
};

// Sub-components
Input.Password = Password;

export { Input };
