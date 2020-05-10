/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import baseStyles from '../../input.module.scss';
import styles from './verification-code.module.scss';

interface VerificationCode extends React.InputHTMLAttributes<HTMLInputElement> {
  numOfFields: number;
  values?: string[];
  onInputChange: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}

const KEY_CODES = {
  backspace: 8,
};

const generateRefs = (numOfFields: any) => {
  const refs: any = [];

  for (let i = 0; i < numOfFields; i++) {
    refs.push(React.createRef());
  }

  return refs;
};

const VerificationCode = ({
  numOfFields,
  values,
  onInputChange,
  onComplete,
  error = false,
  disabled = false,
  className,
  ...restOfProps
}: VerificationCode) => {
  const [inputValues, setInputValues] = useState(Array(numOfFields).fill(''));
  const refs = generateRefs(numOfFields);

  useEffect(() => {
    if (values && values.length) {
      setInputValues(values);
    }
  }, [values]);

  const triggerChange = (codeValues: string[] = inputValues) => {
    const value = codeValues.join('');

    if (onInputChange) {
      onInputChange(value);
    }

    if (onComplete && value.length >= numOfFields) {
      onComplete(value);
    }
  };

  const handleChange = (event: any) => {
    const { value } = event.target;
    const currentRefIndex = parseInt(event.target.dataset.id, 10);
    const inputVals = [...inputValues];
    let nextInput: any = null;
    let nextRefIndex: number = 0;

    if (event.target.value === '') {
      return;
    }

    if (value.length > 1) {
      nextRefIndex = value.length + currentRefIndex - 1;

      if (nextRefIndex >= numOfFields) {
        nextRefIndex = numOfFields - 1;
      }

      nextInput = refs[nextRefIndex];
      const inputValsArray = value.split('');

      inputValsArray.forEach((item: any, i: any) => {
        const cursor = currentRefIndex + i;

        if (cursor < numOfFields) {
          inputVals[cursor] = item;
        }
      });

      setInputValues(inputVals);
    } else {
      nextInput = refs[currentRefIndex + 1];
      inputVals[currentRefIndex] = value;

      setInputValues(inputVals);
    }

    if (nextInput) {
      nextInput.current.focus();
      nextInput.current.select();
    }

    triggerChange(inputVals);
  };

  const onKeyDown = (event: any) => {
    const index = parseInt(event.target.dataset.id, 10);
    const vals = [...inputValues];
    const prevIndex = index - 1;
    const prev = refs[prevIndex];

    switch (event.keyCode) {
      case KEY_CODES.backspace:
        event.preventDefault();

        if (inputValues[index]) {
          vals[index] = '';

          setInputValues(vals);
          triggerChange(vals);
        } else if (prev) {
          vals[prevIndex] = '';

          prev.current.focus();
          setInputValues(vals);
          triggerChange(vals);
        }
        break;
      default:
        break;
    }
  };

  const onFocus = (event: any) => {
    event.target.select(event);
  };

  return (
    <div className={styles.container}>
      {inputValues.map((fieldValue: string, index: number) => {
        const verificationClasses = cx(
          baseStyles.input,
          styles.input,
          { [baseStyles.error]: error, [styles.disabled]: disabled },
          className
        );

        return (
          <input
            data-id={index}
            key={index}
            type="tel"
            value={fieldValue}
            ref={refs[index]}
            className={verificationClasses}
            onChange={handleChange}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            disabled={disabled}
            {...restOfProps}
          />
        );
      })}
    </div>
  );
};

export { VerificationCode };
