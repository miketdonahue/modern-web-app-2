import { useState } from 'react';
import errorMap from '@client/modules/errors/map';

type Error = {
  code?: string;
  message?: string;
};

const useServerErrors = () => {
  const [serverErrors, setErrors] = useState<any>([]);

  const formatServerErrors = (gqlErrors: any) => {
    const formattedErrors = gqlErrors.map((e: any) => {
      const obj: Error = {};
      const { code } = e.extensions;
      const msg = (errorMap as any)[code] || 'Unknown error. Please try again.';

      obj.code = code;
      obj.message = msg;

      return obj;
    });

    setErrors([...serverErrors, ...formattedErrors]);
  };

  return [serverErrors, formatServerErrors];
};

export { useServerErrors };
