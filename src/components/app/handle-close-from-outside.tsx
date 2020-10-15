import React, { useEffect, useRef } from 'react';

type HandleCloseFromOutside = {
  onOutsideClick: () => void;
  children: React.ReactNode;
};

const Wrapper = React.forwardRef(({ children }: any, ref: any) => {
  return <span ref={ref}>{children}</span>;
});

/**
 * Enables close on 'Escape' key and provides outside click handler
 */
const HandleCloseFromOutside = ({
  onOutsideClick,
  children,
}: HandleCloseFromOutside) => {
  const node = useRef<HTMLElement>();

  const handleClick = (e: any) => {
    if (node.current?.contains(e.target)) {
      return;
    }

    if (onOutsideClick) onOutsideClick();
  };

  const handleEscape = (e: any) => {
    if (e.key === 'Escape') {
      if (onOutsideClick) onOutsideClick();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return <Wrapper ref={node}>{children}</Wrapper>;
};

export { HandleCloseFromOutside };
