import jwt from 'jsonwebtoken';
import Cookies from 'universal-cookie';
import { config } from '@config';

type PolicyProps = {
  can?: string;
  show?: boolean;
  children: React.ReactNode;
};

export const Show = ({ can, show = false, children }: PolicyProps) => {
  if (can) {
    const cookies = new Cookies();
    const token = cookies.get(config.server.auth.jwt.tokenNames.payload);
    /*
      Last dot makes full JWT valid so decode works
      Decode does not check for a valid signature anyway, so we fake it
    */
    const decoded: any = jwt.decode(`${token}.`);
    const { permissions } = decoded?.role || { permissions: [] };

    return permissions.includes(can) ? <>{children}</> : null;
  }

  return show ? <>{children}</> : null;
};
