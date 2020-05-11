import React from 'react';
import cx from 'classnames';
import { AlertContext } from './alert-context';
import { Header } from './components/header';
import { Content } from './components/content';
import styles from './alert.module.scss';

interface Alert extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  children: string | JSX.Element | JSX.Element[];
  className?: string;
}

const Alert = ({
  variant = 'info',
  children,
  className,
  ...restOfProps
}: Alert) => {
  const alertClasses = cx(
    styles.alert,
    {
      [styles.info]: variant === 'info',
      [styles.success]: variant === 'success',
      [styles.warning]: variant === 'warning',
      [styles.error]: variant === 'error',
    },
    className
  );

  return (
    <AlertContext.Provider value={{ variant }}>
      <div className={alertClasses} {...restOfProps}>
        <>{children}</>
      </div>
    </AlertContext.Provider>
  );
};

// Sub-components
Alert.Header = Header;
Alert.Content = Content;

export { Alert };
