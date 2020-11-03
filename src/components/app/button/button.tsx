/* eslint-disable react/button-has-type */
import React from 'react';
import cx from 'classnames';
import styles from './button.module.scss';

interface Button extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'default' | 'primary';
  href?: string;
  children: string | React.ReactNode;
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
        [styles.link]: !!href,
      },
      className
    );

    const loaderClasses = cx(styles.loader, {
      [styles.loaderLight]: loading && variant !== 'default',
      [styles.loaderDark]: loading && variant === 'default',
    });

    if (href) {
      buttonProps.href = href;
    }

    const Component: any = href ? 'a' : 'button';

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
