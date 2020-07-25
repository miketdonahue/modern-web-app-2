import { createContext } from 'react';

type Modal = {
  isOpen: boolean;
  closeModal: () => void;
};

const ModalContext = createContext<Modal>({
  isOpen: false,
  closeModal: () => true,
});

export { ModalContext };
