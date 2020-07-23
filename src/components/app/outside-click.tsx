import React, { useEffect, useRef } from 'react';

const Wrapper = React.forwardRef(({ children }: any, ref: any) => {
  return <span ref={ref}>{children}</span>;
});

const OutsideClick = ({ onOutsideClick, children }: any) => {
  const node = useRef<HTMLElement>();

  const handleClick = (e: any) => {
    if (node.current?.contains(e.target)) {
      return;
    }

    if (onOutsideClick) onOutsideClick();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return <Wrapper ref={node}>{children}</Wrapper>;
};

export { OutsideClick };
