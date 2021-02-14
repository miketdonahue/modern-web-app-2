import React from 'react';
import cx from 'classnames';
import { CardContext } from '../../card-context';
import styles from './content.module.scss';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string | React.ReactNode;
  className?: string;
}

const Content = ({ children, className, ...restOfProps }: ContentProps) => (
  <CardContext.Consumer>
    {() => {
      const contentClasses = cx(styles.content, {}, className);

      return (
        <div className={contentClasses} {...restOfProps}>
          {children}
        </div>
      );
    }}
  </CardContext.Consumer>
);

export { Content };
