import React from 'react';
import cx from 'classnames';
import { motion } from 'framer-motion';
import { useDisableBodyScroll } from '@components/hooks/use-disable-body-scroll';
import { HandleCloseFromOutside } from '../handle-close-from-outside';
import { DrawerContext } from './drawer-context';
import { Close } from './components/close';
import styles from './drawer.module.scss';

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  className?: string;
  children: React.ReactNode;
};

const container = {
  open: {
    x: 0,
    transition: { bounce: 0, duration: 0.2 },
  },
  closed: { x: 400, transition: { dampening: 400 } },
};

const backdrop = {
  open: { opacity: 1, transition: { duration: 0.2 } },
  closed: { opacity: 0 },
};

const Drawer = ({
  isOpen,
  width,
  onClose,
  className,
  children,
}: DrawerProps) => {
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    setShown(isOpen);
  }, [isOpen]);

  useDisableBodyScroll(isOpen);

  const drawerClasses = cx(styles.drawer, className);

  return (
    <DrawerContext.Provider value={{ isOpen: shown, onClose }}>
      <HandleCloseFromOutside onOutsideClick={onClose}>
        {shown && (
          <motion.div
            initial="closed"
            animate="open"
            variants={backdrop}
            className={styles.backdrop}
            onClick={onClose}
          />
        )}

        <motion.div
          animate={shown ? 'open' : 'closed'}
          variants={container}
          initial={false}
          className={styles.container}
        >
          <div role="presentation" className={drawerClasses} style={{ width }}>
            <div className={styles.content}>{children}</div>
          </div>
        </motion.div>
      </HandleCloseFromOutside>
    </DrawerContext.Provider>
  );
};

// Sub-components
Drawer.Close = Close;

export { Drawer };
