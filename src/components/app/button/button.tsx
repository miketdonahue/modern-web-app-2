/* eslint-disable react/button-has-type */
import React from 'react';
import cx from 'classnames';
import styles from './button.module.scss';

interface Button extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'default' | 'primary';
  children: string | JSX.Element;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const Button = ({
  type = 'button',
  variant = 'default',
  children,
  loading = false,
  disabled = false,
  className,
  ...restOfProps
}: Button) => {
  const buttonTextClasses = cx({ invisible: loading });
  const buttonClasses = cx(
    styles.button,
    {
      [styles.default]: variant === 'default',
      [styles.primary]: variant === 'primary',
      [styles.disabled]: disabled,
      [styles.loading]: loading,
    },
    className
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      {...restOfProps}
    >
      <span className={buttonTextClasses}>{children}</span>

      {loading && (
        <div className={styles.loader}>
          <div />
          <div />
          <div />
        </div>
      )}
    </button>
  );
};

export { Button };
