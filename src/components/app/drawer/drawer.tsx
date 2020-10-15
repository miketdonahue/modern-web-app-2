import React from 'react';
import { motion } from 'framer-motion';
import { useDisableBodyScroll } from '@components/hooks/use-disable-body-scroll';
import { HandleCloseFromOutside } from '../handle-close-from-outside';
import styles from './drawer.module.scss';

const container = {
  open: {
    x: 0,
    transition: { bounce: 0 },
  },
  closed: { x: 400, transition: { dampening: 400 } },
};

const backdrop = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

export const Drawer = ({ isOpen, onClose, children }: any) => {
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    setShown(isOpen);
  }, [isOpen]);

  useDisableBodyScroll(isOpen);

  return (
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
        <div role="presentation" className={styles.drawer}>
          <button type="button" onClick={onClose}>
            Close
          </button>
          <div className={styles.content}>{children}</div>
        </div>
      </motion.div>
    </HandleCloseFromOutside>
  );
};
