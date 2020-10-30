import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useCreateCart, useSyncCartItems } from '@modules/queries/carts';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';
import { useCreatePaymentSession } from '@modules/queries/payments';
import { AlertError } from '@components/icons';
import { ServerErrors } from '@components/server-error';
import { isAuthenticated } from '@modules/queries/auth';
import { Button, Modal, Alert } from '@components/app';
import { Error } from '@modules/api-response/typings';
import { SignInForm } from '../login/partials/sign-in-form';
import { SignUpForm } from '../register/partials/sign-up-form';
// import styles from './cart.module.scss';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE || '');

const Cart = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [checkingOut, setCheckingOut] = React.useState(false);
  const [isRegisterView, setRegisterView] = React.useState(true);
  const [serverErrors, setServerErrors] = React.useState<Error[]>([]);

  const { items, total, removeCartItem } = useShoppingCart();
  const [createPaymentSession] = useCreatePaymentSession();
  const [createCart, { data: createdCart }] = useCreateCart();
  const [syncCartItems, { data: syncedCartItems }] = useSyncCartItems({
    onSuccess: () => {
      // updateCart(result.data);
    },
  });

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const response = await createPaymentSession({
      orderItems: items,
    });

    const result = await stripe?.redirectToCheckout({
      sessionId: response?.data.attributes.id || '',
    });

    if (result?.error) {
      setServerErrors([
        {
          status: '500',
          code: result.error.code || 'CHECKOUT_ERROR',
          detail:
            result.error.message ||
            'There was a problem checking out your order. Please try again.',
        },
      ]);
    }
  };

  React.useEffect(() => {
    createCart();
  }, []);

  React.useEffect(() => {
    if (createdCart) {
      syncCartItems({
        userId: '',
        cartItems: items,
      });
    }
  }, [createdCart]);

  React.useEffect(() => {
    if (
      syncedCartItems &&
      items &&
      syncedCartItems.data.length !== items.length
    ) {
      syncCartItems({
        userId: '',
        cartItems: items,
      });
    }
  }, [items]);

  isAuthenticated({
    enabled: checkingOut,
    onSuccess: async () => {
      await handleCheckout();
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
      {serverErrors.length > 0 && (
        <Alert variant="error" className="mb-4">
          <div className="mr-3">
            <AlertError size={18} />
          </div>
          <Alert.Content>
            <ServerErrors errors={serverErrors} />
          </Alert.Content>
        </Alert>
      )}

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
                {((item.attributes.price || 0) / 100).toLocaleString('en-US', {
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
                onSuccess={async () => {
                  await handleCheckout();
                }}
                onLogin={toggleAuthView}
              />
            ) : (
              <SignInForm
                onSuccess={async () => {
                  await handleCheckout();
                }}
                onRegister={toggleAuthView}
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>Footer</Modal.Footer>
      </Modal>

      <Button className="mt-4" onClick={() => setCheckingOut(true)}>
        Checkout
      </Button>
    </div>
  );
};

export { Cart };
