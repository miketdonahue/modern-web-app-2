import React from 'react';
import cx from 'classnames';
import { Header } from './components/header';
import { Body } from './components/body';
import { Footer } from './components/footer';
import { Close } from './components/close';
import { ModalContext } from './modal-context';
import { HandleOutsideClose } from '../outside-click';
import styles from './modal.module.scss';

interface Modal extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean;
  onClose: (isOpen: boolean) => void;
}

const Modal = ({
  show,
  onClose,
  className,
  children,
  ...restOfProps
}: Modal) => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(show);
  }, [show]);

  const closeModal = () => {
    setIsOpen(false);

    if (onClose) onClose(isOpen);
  };

  return (
    <ModalContext.Provider value={{ isOpen, closeModal }}>
      {isOpen && (
        <div className={styles.modalContainer}>
          <HandleOutsideClose onHandleOutsideClose={() => closeModal()}>
            <div className={cx(styles.modal, className)} {...restOfProps}>
              <>{children}</>
            </div>
          </HandleOutsideClose>
        </div>
      )}
    </ModalContext.Provider>
  );
};

// Sub-components
Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;
Modal.Close = Close;

export { Modal };
