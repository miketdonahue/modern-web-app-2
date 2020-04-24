/* eslint-disable react/button-has-type */
import React from 'react';
import cx from 'classnames';
import styles from './button.module.scss';

type Button = {
  type: 'button' | 'submit' | 'reset';
  children: string | JSX.Element;
  loading?: boolean;
  disabled?: boolean;
};

const Button = ({
  type = 'button',
  children,
  loading = false,
  disabled = false,
  ...restOfProps
}: Button) => {
  const buttonTextClasses = cx({ invisible: loading });
  const buttonClasses = cx(styles.button, {
    [styles.disabled]: disabled,
    [styles.loading]: loading,
  });

  return (
    <button {...restOfProps} type={type} className={buttonClasses}>
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
