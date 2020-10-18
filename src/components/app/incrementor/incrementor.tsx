import React from 'react';
import { Plus, Minus } from '@components/icons';
import styles from './incrementor.module.scss';

type Incrementor = {
  value?: number;
  size?: number;
  min?: number;
  max?: number;
  onIncrement: (value: number) => void;
  onDecrement: (value: number) => void;
  onChange?: (value: number) => void;
};

export const Incrementor = ({
  value,
  size = 24,
  min = 0,
  max = undefined,
  onIncrement,
  onDecrement,
  onChange,
}: Incrementor) => {
  const [internalValue, setInternalValue] = React.useState(0);

  React.useEffect(() => {
    if (value) {
      setInternalValue(value);
    }
  }, [value]);

  React.useEffect(() => {
    if (onChange) onChange(internalValue);
  }, [internalValue]);

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.button}
        style={{ width: size, height: size }}
        onClick={() => {
          const newValue = internalValue - 1;

          if (min && newValue < min) {
            return undefined;
          }

          setInternalValue(newValue);
          return onDecrement(newValue);
        }}
      >
        <Minus />
      </button>
      <div className={styles.value}>{internalValue}</div>
      <button
        type="button"
        className={styles.button}
        style={{ width: size, height: size }}
        onClick={() => {
          const newValue = internalValue + 1;

          if (max && newValue > max) {
            return undefined;
          }

          setInternalValue(newValue);
          return onIncrement(newValue);
        }}
      >
        <Plus />
      </button>
    </div>
  );
};
