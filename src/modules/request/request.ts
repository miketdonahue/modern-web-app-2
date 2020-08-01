import axios from 'axios';
import Cookies from 'universal-cookie';
import { config } from '@config';

const request = axios.create({
  baseURL: config.server.domain,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

request.interceptors.request.use((configuration) => {
  const cfg = configuration;

  if (typeof window !== 'undefined') {
    const uc = new Cookies(document.cookie);
    const uCookies = uc.getAll();

    if (uCookies['token-payload']) {
      cfg.headers.Authorization = `Bearer ${uCookies['token-payload']}`;
    }
  }

  return cfg;
});

export { request };
