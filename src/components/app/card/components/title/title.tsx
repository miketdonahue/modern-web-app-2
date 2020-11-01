import React from 'react';
import cx from 'classnames';
import { CardContext } from '../../card-context';
import styles from './title.module.scss';

interface Title extends React.HTMLAttributes<HTMLDivElement> {
  children: string | React.ReactNode;
  className?: string;
}

const Title = ({ children, className, ...restOfProps }: Title) => {
  return (
    <CardContext.Consumer>
      {() => {
        const titleClasses = cx(styles.title, {}, className);

        return (
          <div className={titleClasses} {...restOfProps}>
            {children}
          </div>
        );
      }}
    </CardContext.Consumer>
  );
};

export { Title };
