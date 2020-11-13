import jwt from 'jsonwebtoken';
import Cookies from 'universal-cookie';
import { config } from '@config';

export const useActor = () => {
  if (typeof window === 'undefined') {
    return [undefined, { role: {} }];
  }

  const cookies = new Cookies();
  const token = cookies.get(config.server.auth.jwt.tokenNames.payload);

  /*
      Last dot makes full JWT valid so decode works
      Decode does not check for a valid signature anyway, so we fake it
    */
  const decoded: any = jwt.decode(`${token}.`);

  return [
    decoded?.id,
    {
      role: decoded?.role || {},
    },
  ];
};
