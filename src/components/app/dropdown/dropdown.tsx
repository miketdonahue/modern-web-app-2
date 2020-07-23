import React from 'react';
import cx from 'classnames';
import { OutsideClick } from '../outside-click';
import styles from './dropdown.module.scss';

type Dropdown = {
  triggerElement: React.ReactNode;
  behavior?: 'click' | 'hover';
  placement?: 'bottom-left' | 'bottom-center' | 'bottom-right';
  offset?: number;
  className?: string;
  children: React.ReactNode;
};

const TriggerElement = React.forwardRef(
  ({ children, ...restOfProps }: any, ref: any) => {
    return (
      <span ref={ref} {...restOfProps}>
        {children}
      </span>
    );
  }
);

const Dropdown = ({
  triggerElement,
  behavior = 'click',
  placement = 'bottom-left',
  offset = 25,
  className,
  children,
}: Dropdown) => {
  const isClickBehavior = behavior === 'click';

  const [isOpen, setIsOpen] = React.useState(false);

  const containerClasses = cx(styles.container, {
    [styles.dropdownWithHover]: !isClickBehavior,
  });

  const dropdownClasses = cx(
    styles.dropdown,
    {
      [styles.dropdownClick]: isClickBehavior,
      [styles.dropdownHover]: !isClickBehavior,
      [styles.bottomLeft]: placement === 'bottom-left',
      [styles.bottomRight]: placement === 'bottom-right',
      [styles.bottomCenter]: placement === 'bottom-center',
    },
    className
  );

  return (
    <div className={containerClasses}>
      <OutsideClick onOutsideClick={() => setIsOpen(false)}>
        <TriggerElement
          onClick={isClickBehavior ? () => setIsOpen(!isOpen) : null}
        >
          {triggerElement}
        </TriggerElement>

        <div className={dropdownClasses} style={{ top: offset }}>
          {isClickBehavior && isOpen && children}
          {!isClickBehavior && children}
        </div>
      </OutsideClick>
    </div>
  );
};

export { Dropdown };
