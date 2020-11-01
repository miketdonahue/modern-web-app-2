import React from 'react';
import cx from 'classnames';
import { CardContext } from '../../card-context';
import styles from './body.module.scss';

interface Body extends React.HTMLAttributes<HTMLDivElement> {
  children: string | React.ReactNode;
  className?: string;
}

const Body = ({ children, className, ...restOfProps }: Body) => {
  return (
    <CardContext.Consumer>
      {() => {
        const bodyClasses = cx(styles.body, {}, className);

        return (
          <div className={bodyClasses} {...restOfProps}>
            {children}
          </div>
        );
      }}
    </CardContext.Consumer>
  );
};

export { Body };
