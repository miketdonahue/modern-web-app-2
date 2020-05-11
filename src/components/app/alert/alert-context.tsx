import { createContext } from 'react';

type Alert = {
  variant: 'info' | 'success' | 'warning' | 'error';
};

const AlertContext = createContext<Alert>({ variant: 'info' });

export { AlertContext };
