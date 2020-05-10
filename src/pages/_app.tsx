/* eslint-disable react/jsx-props-no-spreading */
import { AppProps } from 'next/app';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/core/tailwind.css';
import '../styles/core/app-base.scss';

export default function MyApp({ Component, pageProps, router }: AppProps) {
  const spring = {
    type: 'spring',
    damping: 20,
    stiffness: 100,
    when: 'afterChildren',
  };

  return (
    <AnimatePresence>
      <div className="page-transition-wrapper">
        <motion.div
          transition={spring}
          key={router.pathname}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          id="page-transition-container"
        >
          <Component {...pageProps} key={router.pathname} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
