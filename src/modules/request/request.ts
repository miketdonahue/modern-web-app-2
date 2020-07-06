import axios from 'axios';
import Cookies from 'universal-cookie';

const request = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

request.interceptors.request.use((configuration) => {
  const config = configuration;

  if (typeof window !== 'undefined') {
    const uc = new Cookies(document.cookie);
    const uCookies = uc.getAll();

    if (uCookies['token-payload']) {
      config.headers.Authorization = `Bearer ${uCookies['token-payload']}`;
    }
  }

  return config;
});

export { request };
