/* eslint-disable react/jsx-props-no-spreading */
import { AppProps } from 'next/app';
import Router from 'next/router';
import { ReactQueryDevtools } from 'react-query-devtools';
import { request } from '@modules/request';
import { ReactQueryConfigProvider } from 'react-query';
import 'focus-visible/dist/focus-visible.min';
import '../styles/core/tailwind.css';
import '../styles/core/app-base.scss';

const reactQueryConfig = {
  queries: {
    retry: (failureCount: number, error: any) => {
      const unauthorizedError = error.response.data.error.find(
        (err: any) => err.status === 401
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
  return (
    <ReactQueryConfigProvider config={reactQueryConfig}>
      <Component {...pageProps} key={router.pathname} />
      <ReactQueryDevtools initialIsOpen={false} />
    </ReactQueryConfigProvider>
  );
}
