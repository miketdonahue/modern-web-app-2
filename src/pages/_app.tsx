import { AppProps } from 'next/app';
import '../styles/core/tailwind.css';
import '../styles/core/app-base.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />;
}
