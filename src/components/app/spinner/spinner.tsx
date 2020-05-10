import React from 'react';
import cx from 'classnames';
import styles from './spinner.module.scss';

interface Spinner extends React.HTMLAttributes<HTMLDivElement> {
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
}: Spinner) => {
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
