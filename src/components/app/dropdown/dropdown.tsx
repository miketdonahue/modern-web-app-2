import React from 'react';
import DropdownBase from 'react-overlays/Dropdown';
import { Toggle } from './components/toggle';
import { Menu } from './components/menu';

type Dropdown = {
  drop?: 'up' | 'down' | 'left' | 'right';
  alignEnd?: boolean;
  defaultShow?: boolean;
  show?: boolean;
  triggerBehavior?: 'hover' | 'click';
  onToggle?: (nextShow: boolean, event?: React.SyntheticEvent) => void;
  itemSelector?: string;
  focusFirstItemOnShow?: false | true | 'keyboard';
  children: React.ReactNode;
};

const Dropdown = ({
  show,
  onToggle,
  triggerBehavior = 'hover',
  drop,
  alignEnd,
  children,
}: Dropdown) => {
  const isClickBehavior = triggerBehavior === 'click';
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    setShown(!!show);
  }, [show]);

  const handleToggle = (isOpen: boolean, event?: React.SyntheticEvent) => {
    if (onToggle) return onToggle(isOpen, event);
    return isClickBehavior ? setShown(isOpen) : undefined;
  };

  return (
    <DropdownBase
      show={shown}
      onToggle={handleToggle}
      drop={drop}
      alignEnd={alignEnd}
      itemSelector="button:not(:disabled)"
    >
      {({ props }) => (
        <div
          {...props}
          onMouseEnter={() => (!isClickBehavior ? setShown(true) : null)}
          onMouseLeave={() => (!isClickBehavior ? setShown(false) : null)}
        >
          {children}
        </div>
      )}
    </DropdownBase>
  );
};

Dropdown.Toggle = Toggle;
Dropdown.Menu = Menu;

export { Dropdown };
