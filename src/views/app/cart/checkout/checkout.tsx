import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { createCart, createCartItems } from '@modules/queries/carts';
import { Data } from '@modules/api-response/typings';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';
import { BillingForm } from './components/billing-form';
import { PaymentForm } from './components/payment-form';

const promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE || '');

const Checkout = () => {
  const { items, updateCart } = useShoppingCart();
  const [view, setView] = React.useState('billing');

  const [createACart, { data: createdCart }] = createCart();
  const [addCartItems] = createCartItems({
    onSuccess: (result) => {
      const products = result.data.map(
        (item: Data) => item.relationships?.product
      );

      updateCart(products);
    },
  });

  React.useEffect(() => {
    createACart({});
  }, []);

  React.useEffect(() => {
    if (createdCart) {
      addCartItems({ cartId: createdCart.data.id, cartItems: items });
    }
  }, [createdCart]);

  return (
    <div className="p-8">
      <div>Checkout</div>
      {view === 'billing' && (
        <BillingForm onSuccess={() => setView('payment')} />
      )}

      {view === 'payment' && (
        <Elements stripe={promise}>
          <PaymentForm />
        </Elements>
      )}
    </div>
  );
};

export { Checkout };
