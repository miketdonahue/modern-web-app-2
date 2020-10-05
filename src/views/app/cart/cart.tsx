import React from 'react';
import { useRouter } from 'next/router';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';
import { isAuthenticated } from '@modules/queries/auth';
import { Button, Modal } from '@components/app';
import { Error } from '@modules/api-response/typings';
import { SignInForm } from '../login/partials/sign-in-form';
import { SignUpForm } from '../register/partials/sign-up-form';
// import styles from './cart.module.scss';

const Cart = () => {
  const router = useRouter();
  const { items, total, removeCartItem } = useShoppingCart();
  const [showModal, setShowModal] = React.useState(false);
  const [checkingOut, setCheckingOut] = React.useState(false);
  const [isRegisterView, setRegisterView] = React.useState(true);

  isAuthenticated({
    enabled: checkingOut,
    onSuccess: () => {
      router.push('/app/cart/checkout');
    },
    onError: (error) => {
      return error?.response?.data?.error.map((e: Error) => {
        if (e.code === 'UNAUTHENTICATED') {
          setShowModal(true);
          setCheckingOut(false);
        }
      });
    },
  });

  const handleCloseModal = () => {
    setShowModal(false);
    setRegisterView(true);
  };

  const toggleAuthView = () => {
    setRegisterView(!isRegisterView);
  };

  return (
    <div>
      <ul>
        {items?.map((item) => {
          return (
            <li key={item.attributes.id} className="flex space-x-8">
              <div>
                <img
                  src={`/images/products/${item.attributes.id}.jpg`}
                  alt={item.attributes.name}
                  width="75"
                />
              </div>
              <div>{item.attributes.name}</div>
              <button type="button" onClick={() => removeCartItem(item)}>
                Remove
              </button>
              <div>
                {(
                  (item.relationships?.price.unit_amount || 0) / 100
                ).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-8">
        Subtotal:{' '}
        {total.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}
      </div>

      <Modal show={showModal} onClose={handleCloseModal}>
        <Modal.Header>
          Header
          <Modal.Close>X</Modal.Close>
        </Modal.Header>
        <Modal.Body>
          <div className="py-4 px-8">
            {isRegisterView ? (
              <SignUpForm
                successUrl="/app/cart/checkout"
                onLogin={toggleAuthView}
              />
            ) : (
              <SignInForm
                successUrl="/app/cart/checkout"
                onRegister={toggleAuthView}
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>Footer</Modal.Footer>
      </Modal>

      <Button
        href="/app/cart/checkout"
        className="mt-4"
        onClick={() => setCheckingOut(true)}
      >
        Checkout
      </Button>
    </div>
  );
};

export { Cart };
