import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { createCart, createCartItems } from '@modules/queries/carts';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';
import { BillingForm } from './components/billing-form';

const promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE || '');

const Checkout = () => {
  const { items, updateCart } = useShoppingCart();

  const [createACart, { data: createdCart }] = createCart();
  const [addCartItems, { data: createdCartItems }] = createCartItems({
    onSuccess: (result) => {
      const products = result.data.map(
        (item: any) => item.relationships?.product
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
      <Elements stripe={promise}>
        <BillingForm orderItems={createdCartItems?.data} />
      </Elements>
    </div>
  );
};

export { Checkout };
