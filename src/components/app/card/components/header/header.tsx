import React from 'react';
import cx from 'classnames';
import { CardContext } from '../../card-context';
import styles from './header.module.scss';

interface Header extends React.HTMLAttributes<HTMLDivElement> {
  children: string | React.ReactNode;
  className?: string;
}

const Header = ({ children, className, ...restOfProps }: Header) => {
  return (
    <CardContext.Consumer>
      {() => {
        const headerClasses = cx(styles.header, {}, className);

        return (
          <div className={headerClasses} {...restOfProps}>
            {children}
          </div>
        );
      }}
    </CardContext.Consumer>
  );
};

export { Header };
