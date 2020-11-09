import React from 'react';
import cx from 'classnames';
import styles from './spinner.module.scss';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  indeterminate?: boolean;
  active?: boolean | NodeJS.Timeout;
}

const Spinner = ({
  size = 2,
  active = false,
  indeterminate = false,
  className,
  ...restOfProps
}: SpinnerProps) => {
  const spinnerStyles = cx(styles.spinner, {
    [styles.indeterminate]: indeterminate,
    [styles.active]: active,
  });

  return (
    <div className="inline-flex flex-col items-center">
      <div
        className={spinnerStyles}
        style={{
          width: `${size}rem`,
          height: `${size}rem`,
          borderWidth: `${size / 10}rem`,
        }}
        {...restOfProps}
      />
    </div>
  );
};

export { Spinner };
