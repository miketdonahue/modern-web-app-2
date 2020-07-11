import jwt from 'jsonwebtoken';
import Cookies from 'universal-cookie';

const Policy = ({ can, children }: any) => {
  const cookies = new Cookies();
  const token = cookies.get('token-payload');

  /*
    Last dot makes full JWT valid so decode works
    Decode does not check for a valid signature anyway, so we fake it
  */
  const decoded: any = jwt.decode(`${token}.`);

  const { permissions } = decoded?.role || { permissions: [] };
  return permissions.includes(can) && children;
};

export { Policy };
