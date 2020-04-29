import React, { useState } from 'react';
import cx from 'classnames';
import { EyeOpen, EyeClosed } from '@components/icons';
import baseStyles from '../../input.module.scss';
import styles from './password.module.scss';

interface Password extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  disabled?: boolean;
}

const Password = ({
  error = false,
  disabled = false,
  className,
  ...restOfProps
}: Password) => {
  const [passwordShown, setPasswordShown] = useState(false);

  const handlePasswordShown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();

    setPasswordShown(!passwordShown);
  };

  const inputClasses = cx(
    baseStyles.input,
    styles.input,
    { [baseStyles.error]: error },
    className
  );

  return (
    <div className={styles.container}>
      <input
        type={passwordShown ? 'text' : 'password'}
        className={inputClasses}
        disabled={disabled}
        {...restOfProps}
      />
      <div
        className={styles.eye}
        onClick={handlePasswordShown}
        role="switch"
        tabIndex={0}
        aria-checked={passwordShown}
        onKeyPress={() => {}}
      >
        {passwordShown ? <EyeClosed size={18} /> : <EyeOpen size={18} />}
      </div>
    </div>
  );
};

export { Password };
