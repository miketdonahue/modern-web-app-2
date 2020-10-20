import React from 'react';
import { useRouter } from 'next/router';
import { useCreatePaymentSession } from '@modules/queries/payments';
import { useCreateCart, useSyncCartItems } from '@modules/queries/carts';
import { isAuthenticated } from '@modules/queries/auth';
import { useCheckout } from '@components/hooks/use-checkout';
import {
  Cart as CartIcon,
  Button,
  Drawer,
  Incrementor,
  Alert,
} from '@components/app';
import { AlertError, Trash } from '@components/icons';
import { ServerErrors } from '@components/server-error';
import { ShoppingBag } from '@components/illustrations';
import { Error } from '@modules/api-response/typings';
import { ShoppingCartContext } from '../../shopping-cart-context';
import styles from './cart.module.scss';

export const Cart = () => {
  const router = useRouter();
  const {
    items,
    quantity,
    total,
    incrementItem,
    decrementItem,
    removeCartItem,
    updateCart,
    // status,
    // addCartItem,
    // clearCart,
    // calculateQuantity,
  } = React.useContext(ShoppingCartContext);
  console.log('XXXX', {
    items,
    quantity,
    total,
    incrementItem,
    decrementItem,
    removeCartItem,
    updateCart,
  });
  const [open, setOpen] = React.useState(false);
  const [checkingOut, setCheckingOut] = React.useState(false);
  const [serverErrors, setServerErrors] = React.useState<Error[]>([]);
  const [createPaymentSession] = useCreatePaymentSession();
  const [createCart] = useCreateCart();
  const [syncCartItems] = useSyncCartItems({
    onSuccess: (result) => {
      if (updateCart) updateCart(result.data);
    },
  });

  const handleCheckout = async () => {
    createCart(
      {},
      {
        onSuccess: (createdCart) => {
          syncCartItems({
            cartId: createdCart.data.attributes.id || '',
            cartItems: items || [],
          });
        },
      }
    );

    const response = await createPaymentSession({
      orderItems: items || [],
    });

    const checkoutError = await useCheckout({
      sessionId: response.data.attributes.id,
    });

    if (checkoutError) {
      return setServerErrors([{ ...checkoutError }]);
    }

    return undefined;
  };

  isAuthenticated({
    enabled: checkingOut,
    onSuccess: async () => {
      await handleCheckout();
    },
    onError: (error) => {
      return error?.response?.data?.error.map((e: Error) => {
        if (e.code === 'UNAUTHENTICATED') {
          return router.push(
            '/app/login?return_to=checkout',
            '/app/login?return_to=checkout'
          );
        }

        return undefined;
      });
    },
  });

  return (
    <>
      <CartIcon count={quantity || 0} onClick={() => setOpen(true)} />

      {/* Drawer */}
      <Drawer
        isOpen={open}
        onClose={() => setOpen(false)}
        className="rounded-tl-md rounded-bl-md"
        width="24rem"
      >
        <div className="flex flex-col h-full relative px-5 py-6 space-y-3">
          <div className="relative">
            <div className="flex-1 text-xl text-center font-medium leading-tight">
              My Cart
            </div>
            <Drawer.Close className={styles.close} />
          </div>

          <ul className="flex-1 divide-y last:divide-y-0 divide-gray-200">
            {!items?.length && (
              <div className="flex flex-col justify-center items-center space-y-6 h-full">
                <ShoppingBag size={225} className="mx-auto" />
                <div className="text-center font-medium mt-8">
                  Your cart is currently empty.
                </div>
                <Button variant="primary" onClick={() => setOpen(false)}>
                  Continue shopping
                </Button>
              </div>
            )}

            {items?.map((item) => {
              return (
                <li key={item.attributes.id} className="py-3">
                  <div className="flex justify-between space-x-3">
                    <div>
                      <img
                        src={`/images/products/${item.attributes.id}.jpg`}
                        alt={item.attributes.name}
                        className="h-16 w-16 rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between space-x-8">
                          <div>{item.attributes.name}</div>
                          <div className="font-medium">
                            {(
                              (item.relationships?.price.unit_amount || 0) / 100
                            ).toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            })}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Incrementor
                              value={item.attributes.quantity}
                              min={1}
                              onIncrement={() => {
                                if (incrementItem) incrementItem(item);
                              }}
                              onDecrement={() => {
                                if (decrementItem) decrementItem(item);
                              }}
                            />
                          </div>

                          <div className={styles.trash}>
                            <Trash
                              size={18}
                              onClick={() => {
                                if (removeCartItem) removeCartItem(item);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {(quantity || 0) > 0 && (
            <>
              <div className="flex items-center justify-between font-medium pt-2">
                <div>Item Total</div>

                <div>
                  {total?.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </div>
              </div>

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

              <div className="flex justify-center">
                <Button
                  variant="primary"
                  className="w-11/12"
                  onClick={() => setCheckingOut(true)}
                >
                  Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
};
