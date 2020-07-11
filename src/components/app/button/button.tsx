/* eslint-disable react/button-has-type */
import React from 'react';
import cx from 'classnames';
import styles from './button.module.scss';

interface Button extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  component?: string;
  variant?: 'default' | 'primary';
  href?: string;
  children: string | JSX.Element;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

type ButtonProps = {
  href?: string;
};

const Button = ({
  type = 'button',
  component = 'button',
  variant = 'default',
  href,
  children,
  loading = false,
  disabled = false,
  className,
  ...restOfProps
}: Button) => {
  const buttonProps: ButtonProps = {};
  const buttonTextClasses = cx({ invisible: loading });
  const buttonClasses = cx(
    styles.button,
    {
      [styles.default]: variant === 'default',
      [styles.primary]: variant === 'primary',
      [styles.disabled]: disabled,
      [styles.loading]: loading,
      [styles.link]: component === 'a',
    },
    className
  );

  if (component === 'a') {
    buttonProps.href = href;
  }

  const Component: any = component;

  return (
    <Component
      type={type}
      className={buttonClasses}
      disabled={disabled}
      {...buttonProps}
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
    </Component>
  );
};

export { Button };
