import React from 'react';
import cx from 'classnames';
import { useSelect } from 'downshift';
import { ChevronDown } from '@components/icons';
import styles from './select.module.scss';

interface Select extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id?: string;
  menuId: string;
  className?: string;
  items: string[];
  value?: string;
  placeholder: string;
  onSelection?: (selected: string | null) => void;
  error?: boolean;
  children: (item: string) => void;
}

export const Select = ({
  id,
  menuId,
  className,
  items,
  value,
  placeholder,
  onSelection,
  error = false,
  children,
  ...restOfProps
}: Select) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({ id, menuId, items, defaultSelectedItem: value });

  React.useEffect(() => {
    if (onSelection) onSelection(selectedItem);
  }, [selectedItem]);

  const selectClasses = cx(
    styles.select,
    {
      [styles.error]: error,
    },
    className
  );

  const arrowClasses = cx(styles.arrow, {
    [styles.arrowOpen]: isOpen,
  });

  const placeholderClasses = cx({
    [styles.placeholder]: !selectedItem,
  });

  const menuStyles = cx(styles.menu, {
    [styles.menuBorder]: !isOpen,
  });

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={selectClasses}
        {...getToggleButtonProps()}
        {...restOfProps}
      >
        <span className={placeholderClasses}>
          {selectedItem || placeholder}
        </span>
        <ChevronDown size={16} className={arrowClasses} />
      </button>
      <ul className={menuStyles} {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => {
            const itemClasses = cx(styles.item, {
              [styles.highlight]: highlightedIndex === index,
            });

            return (
              <li
                className={itemClasses}
                key={item}
                {...getItemProps({ item, index })}
              >
                {children(item)}
              </li>
            );
          })}
      </ul>
    </div>
  );
};
