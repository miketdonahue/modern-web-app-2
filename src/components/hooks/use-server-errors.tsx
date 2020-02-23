import { useState } from 'react';
import errorMap from '@client/modules/errors/map';

type Error = {
  code?: string;
  message?: string;
};

const useServerErrors = () => {
  const [serverErrors, setErrors] = useState([]);

  const formatServerErrors = (gqlErrors: any) => {
    const formattedErrors = gqlErrors.map((e: any) => {
      const obj: Error = {};
      const { code } = e.extensions;
      const msg = (errorMap as any)[code];

      obj.code = code;
      obj.message = msg;

      return obj;
    });

    setErrors([...serverErrors, ...formattedErrors]);
  };

  return [serverErrors, formatServerErrors];
};

export { useServerErrors };
