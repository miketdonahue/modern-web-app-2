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
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

type ButtonProps = {
  href?: string;
};

const Button = React.forwardRef(
  (
    {
      type = 'button',
      component = 'button',
      variant = 'default',
      href,
      children,
      fullWidth = false,
      loading = false,
      disabled = false,
      className,
      ...restOfProps
    }: Button,
    ref
  ) => {
    const buttonProps: ButtonProps = {};
    const buttonTextClasses = cx({ [styles.invisible]: loading });
    const buttonClasses = cx(
      styles.button,
      {
        [styles.default]: variant === 'default',
        [styles.primary]: variant === 'primary',
        [styles.fullWidth]: fullWidth,
        [styles.disabled]: disabled,
        [styles.loading]: loading,
        [styles.link]: component === 'a',
      },
      className
    );

    const loaderClasses = cx(styles.loader, {
      [styles.loaderLight]: loading && variant !== 'default',
      [styles.loaderDark]: loading && variant === 'default',
    });

    if (component === 'a') {
      buttonProps.href = href;
    }

    const Component: any = component;

    return (
      <Component
        type={type}
        className={buttonClasses}
        disabled={disabled}
        ref={ref}
        {...buttonProps}
        {...restOfProps}
      >
        <span className={buttonTextClasses}>{children}</span>

        {loading && (
          <div className={loaderClasses}>
            <div />
            <div />
            <div />
          </div>
        )}
      </Component>
    );
  }
);

export { Button };
