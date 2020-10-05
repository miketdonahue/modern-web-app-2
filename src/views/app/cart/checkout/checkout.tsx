import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { createCart, syncCartItems } from '@modules/queries/carts';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';
import { BillingForm } from './components/billing-form';

const promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE || '');

const Checkout = () => {
  const { items, updateCart } = useShoppingCart();

  const [createACart, { data: createdCart }] = createCart();
  const [mergeCartItems /* { data: orderItems } */] = syncCartItems({
    onSuccess: (result) => {
      updateCart(result.data);
    },
  });

  React.useEffect(() => {
    createACart({});
  }, []);

  React.useEffect(() => {
    if (createdCart) {
      mergeCartItems({
        cartId: createdCart.data.attributes.id,
        cartItems: items,
      });
    }
  }, [createdCart]);

  return (
    <div className="p-8">
      <Elements stripe={promise}>
        <BillingForm />
      </Elements>
    </div>
  );
};

export { Checkout };
