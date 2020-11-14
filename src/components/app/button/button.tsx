/* eslint-disable react/button-has-type */
import React from 'react';
import cx from 'classnames';
import { Link, LinkProps } from './components/link';
import styles from './button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'default' | 'primary';
  href?: string;
  children: string | React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

interface CompoundedComponent
  extends React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  > {
  Link: ({ children, ...restOfProps }: LinkProps) => JSX.Element;
}

type ButtonLinkProps = {
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
    }: ButtonProps,
    ref
  ) => {
    const buttonProps: ButtonLinkProps = {};
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
) as CompoundedComponent;

// Sub-components
Button.Link = Link;

export { Button };
