/* eslint-disable react/jsx-props-no-spreading */
import { AppProps } from 'next/app';
import Router from 'next/router';
import { request } from '@modules/request';
import { ReactQueryConfigProvider } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/core/tailwind.css';
import '../styles/core/app-base.scss';

const reactQueryConfig = {
  queries: {
    retry: (failureCount: number, error: any) => {
      if (error?.response?.status === 401) {
        /* Ensure actor is logged out when client-side XHR is unauthenticated */
        request.post('/api/v1/auth/logout');
        Router.push('/app/login');
        return false;
      }

      if (failureCount > 3) return false;
      return true;
    },
  },
};

export default function MyApp({ Component, pageProps, router }: AppProps) {
  const spring = {
    type: 'spring',
    damping: 20,
    stiffness: 100,
    when: 'afterChildren',
  };

  return (
    <ReactQueryConfigProvider config={reactQueryConfig}>
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
    </ReactQueryConfigProvider>
  );
}
