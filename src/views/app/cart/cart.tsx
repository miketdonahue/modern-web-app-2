import React from 'react';
// import Link from 'next/link';
import { Product as ProductModel } from '@server/entities/product';
// import { useRouter } from 'next/router';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';
import { isAuthenticated } from '@modules/queries/auth';
import { Button, Modal } from '@components/app';
import { Data, Error } from '@modules/api-response/typings';
// import styles from './cart.module.scss';

type Product = Data & {
  attributes: ProductModel;
};

const Cart = () => {
  const { cart, cartTotal, removeCartItem } = useShoppingCart();
  const [showModal, setShowModal] = React.useState(false);
  const [checkingOut, setCheckingOut] = React.useState(false);

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
        <Modal.Body>Body</Modal.Body>
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
