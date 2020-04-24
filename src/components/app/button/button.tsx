import React from 'react';
import cx from 'classnames';
import styles from './button.module.scss';

const Button = ({ loading = false, disabled = false }: any) => {
  const buttonTextClasses = cx({ invisible: loading });
  const buttonClasses = cx(styles.button, {
    [styles.disabled]: disabled,
    [styles.loading]: loading,
  });

  return (
    <button type="submit" className={buttonClasses}>
      <span className={buttonTextClasses}>Sign in</span>

      {loading && (
        <div className={styles.loader}>
          <div />
          <div />
          <div />
        </div>
      )}
    </button>
  );
};

export { Button };
