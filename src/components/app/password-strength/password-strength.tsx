import React from 'react';
import cx from 'classnames';
import styles from './password-strength.module.scss';

type PasswordStrengthProps = {
  password: string;
  className?: string;
};

const calculatedStrength = (password: string) => {
  let text = '';
  const strongRegExp = new RegExp(
    /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{16,}$/
  );

  const goodRegExp = new RegExp(
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/
  );

  if (strongRegExp.test(password)) {
    text = 'Strong';
  } else if (goodRegExp.test(password)) {
    text = 'Good';
  } else if (!strongRegExp.test(password) && !goodRegExp.test(password)) {
    text = 'Weak';
  }

  return text;
};

const PasswordStrength = ({
  password = '',
  className,
  ...restOfProps
}: PasswordStrengthProps) => {
  const passwordStrengthText = calculatedStrength(password);
  const passwordStrengthClasses = cx({
    [styles.strong]: passwordStrengthText === 'Strong',
    [styles.good]: passwordStrengthText === 'Good',
    [styles.weak]: passwordStrengthText === 'Weak',
  });

  return (
    <span className={cx(passwordStrengthClasses, className)} {...restOfProps}>
      {passwordStrengthText}
    </span>
  );
};

export { PasswordStrength };
