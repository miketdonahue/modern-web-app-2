import React from 'react';

/**
 * Disables the body from scrolling
 */
export const useDisableBodyScroll = (flag: boolean) => {
  React.useEffect(() => {
    if (flag) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [flag]);
};
