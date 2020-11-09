import React from 'react';
import DropdownBase from 'react-overlays/Dropdown';
import { Toggle } from './components/toggle';
import { Menu } from './components/menu';

type DropdownProps = {
  drop?: 'up' | 'down' | 'left' | 'right';
  alignEnd?: boolean;
  defaultShow?: boolean;
  show?: boolean;
  onToggle?: (nextShow: boolean, event?: React.SyntheticEvent) => void;
  itemSelector?: string;
  focusFirstItemOnShow?: false | true | 'keyboard';
  children: React.ReactNode;
};

const Dropdown = ({
  show,
  onToggle,
  drop,
  alignEnd,
  children,
}: DropdownProps) => {
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    setShown(!!show);
  }, [show]);

  const handleToggle = (isOpen: boolean, event?: React.SyntheticEvent) => {
    if (onToggle) return onToggle(isOpen, event);
    return setShown(isOpen);
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
          onMouseEnter={() => setShown(true)}
          onMouseLeave={() => setShown(false)}
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
