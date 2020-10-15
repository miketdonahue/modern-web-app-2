import React from 'react';

/**
 * Provides a way to keep a previous value across re-renders
 */
export const usePrevious = (value: any) => {
  const ref = React.useRef();

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};
