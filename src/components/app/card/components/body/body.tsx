import React from 'react';
import cx from 'classnames';
import { CardContext } from '../../card-context';
import styles from './body.module.scss';

interface BodyProps extends React.HTMLAttributes<HTMLDivElement> {
  characterLimit?: number;
  children: string | React.ReactNode;
  className?: string;
}

const Body = ({
  characterLimit,
  children,
  className,
  ...restOfProps
}: BodyProps) => (
  <CardContext.Consumer>
    {() => {
      const bodyClasses = cx(styles.body, {}, className);

      const childrenNode =
        typeof children === 'string' && characterLimit && characterLimit > 0
          ? `${children.slice(0, characterLimit)}...`
          : children;

      return (
        <div className={bodyClasses} {...restOfProps}>
          {childrenNode}
        </div>
      );
    }}
  </CardContext.Consumer>
);

export { Body };
