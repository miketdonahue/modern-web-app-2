import { createContext } from 'react';

type Drawer = {
  isOpen: boolean;
  onClose: () => void;
};

const DrawerContext = createContext<Drawer>({
  isOpen: false,
  onClose: () => {},
});

export { DrawerContext };
