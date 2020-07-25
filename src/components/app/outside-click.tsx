import React, { useEffect, useRef } from 'react';

const Wrapper = React.forwardRef(({ children }: any, ref: any) => {
  return <span ref={ref}>{children}</span>;
});

const HandleOutsideClose = ({ onHandleOutsideClose, children }: any) => {
  const node = useRef<HTMLElement>();

  const handleClick = (e: any) => {
    if (node.current?.contains(e.target)) {
      return;
    }

    if (onHandleOutsideClose) onHandleOutsideClose();
  };

  const handleEscape = (e: any) => {
    if (e.key === 'Escape') {
      if (onHandleOutsideClose) onHandleOutsideClose();
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

export { HandleOutsideClose };
