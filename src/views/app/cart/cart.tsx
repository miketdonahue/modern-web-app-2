import React from 'react';
// import Link from 'next/link';
import { Product as ProductModel } from '@server/entities/product';
// import { useRouter } from 'next/router';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';
import { isAuthenticated } from '@modules/queries/auth';
import { Button, Modal } from '@components/app';
import { Data, Error } from '@modules/api-response/typings';
import { SignInForm } from '../login/partials/sign-in-form';
import { SignUpForm } from '../register/partials/sign-up-form';
// import styles from './cart.module.scss';

type Product = Data & {
  attributes: ProductModel;
};

const Cart = () => {
  const { cart, cartTotal, removeCartItem } = useShoppingCart();
  const [showModal, setShowModal] = React.useState(false);
  const [checkingOut, setCheckingOut] = React.useState(false);
  const [isRegisterView, setRegisterView] = React.useState(false);

  isAuthenticated({
    enabled: checkingOut,
    onError: (error) => {
      return error?.response?.data?.error.map((e: Error) => {
        if (e.code === 'UNAUTHENTICATED') {
          setShowModal(true);
          setCheckingOut(false);
        }
      });
    },
  });

  const toggleAuthView = () => {
    setRegisterView(!isRegisterView);
  };

  return (
    <div>
      <ul>
        {cart?.map((item: Product) => {
          return (
            <li key={item.id} className="flex space-x-8">
              <div>
                <img
                  src={item.attributes.thumbnail}
                  alt={item.attributes.name}
                  width="75"
                />
              </div>
              <div>{item.attributes.name}</div>
              <button type="button" onClick={() => removeCartItem(item)}>
                Remove
              </button>
              <div>
                {item.attributes.price.toLocaleString('en-US', {
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
        {cartTotal.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
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
