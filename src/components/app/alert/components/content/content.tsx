import React from 'react';
import cx from 'classnames';
import styles from './content.module.scss';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string | React.ReactNode;
  className?: string;
}

const Content = ({ children, className, ...restOfProps }: ContentProps) => {
  const contentClasses = cx(styles.content, className);

  return (
    <div className={contentClasses} {...restOfProps}>
      {children}
    </div>
  );
};

export { Content };
