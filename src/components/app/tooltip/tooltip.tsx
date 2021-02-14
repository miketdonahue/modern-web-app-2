import React, { forwardRef } from 'react';
import cx from 'classnames';
import Tippy, { TippyProps } from '@tippyjs/react/headless';
import styles from './tooltip.module.scss';

const Wrapper = forwardRef((props: any, ref: any) => (
  <span ref={ref}>{props.children}</span>
));

const Tooltip = ({
  content,
  className,
  children,
  ...restOfProps
}: TippyProps) => (
  <Tippy
    inertia
    popperOptions={{
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    }}
    render={(attrs) => (
      <div className={cx(styles.tooltip, className)} {...attrs}>
        {content}
        <div className={styles.arrow} data-popper-arrow />
      </div>
    )}
    {...restOfProps}
  >
    <Wrapper>{children}</Wrapper>
  </Tippy>
);

export { Tooltip };
