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
      const unauthorizedError = error.response.data.error.find(
        (err: any) => err.status === '401'
      );

      /*
        If bypass failure redirect is set do not redirect, but also fail immediately
        because the request should not be retried
      */
      if (unauthorizedError && unauthorizedError.meta.bypassFailureRedirect) {
        return false;
      }

      /* If the error is a 401 unauthenticated, redirect to login */
      if (unauthorizedError && !unauthorizedError.meta.bypassFailureRedirect) {
        /* Try to get a new token to stay logged in */
        request.get('/api/v1/auth/get-token').catch(() => {
          request.post('/api/v1/auth/logout');
          Router.push('/app/login');
        });
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
