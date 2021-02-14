import React from 'react';
import cx from 'classnames';
import { CardContext } from '../../card-context';
import styles from './actions.module.scss';

interface ActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string | React.ReactNode;
  className?: string;
}

const Actions = ({ children, className, ...restOfProps }: ActionsProps) => (
  <CardContext.Consumer>
    {() => {
      const actionsClasses = cx(styles.actions, {}, className);

      return (
        <div className={actionsClasses} {...restOfProps}>
          {children}
        </div>
      );
    }}
  </CardContext.Consumer>
);

export { Actions };
