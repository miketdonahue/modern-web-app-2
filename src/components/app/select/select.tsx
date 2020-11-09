import React from 'react';
import cx from 'classnames';
import { useSelect } from 'downshift';
import { ChevronDown } from '@components/icons';
import { SelectItem } from './typings';
import styles from './select.module.scss';

type SelectProps = {
  id?: string;
  name?: string;
  menuId: string;
  className?: string;
  items: SelectItem[];
  value?: SelectItem;
  placeholder: string;
  onSelection?: (selected: SelectItem | null) => void;
  error?: boolean;
  children: (item: SelectItem) => void;
};

export const Select = ({
  id,
  menuId,
  name,
  className,
  items,
  value,
  placeholder,
  onSelection,
  error = false,
  children,
}: SelectProps) => {
  const itemToString = (item: SelectItem | null) =>
    item?.label ? item.label : '';
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    id,
    menuId,
    items,
    defaultSelectedItem: value,
    itemToString,
  });

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
    [styles.placeholder]: !selectedItem?.label,
  });

  const menuStyles = cx(styles.menu, {
    [styles.menuBorder]: !isOpen,
  });

  return (
    <div className={styles.container}>
      <button
        type="button"
        name={name}
        className={selectClasses}
        {...getToggleButtonProps()}
      >
        <span className={placeholderClasses}>
          {selectedItem?.label ? itemToString(selectedItem) : placeholder}
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
                {...getItemProps({
                  key: item.id,
                  className: itemClasses,
                  item,
                  value: item.label,
                  index,
                })}
              >
                {children(item)}
              </li>
            );
          })}
      </ul>
    </div>
  );
};
