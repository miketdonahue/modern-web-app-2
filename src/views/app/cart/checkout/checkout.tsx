import React from 'react';
import { createCart, createCartItems } from '@modules/queries/carts';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';

const Checkout = () => {
  const { items } = useShoppingCart();
  const [mutate /* { data, isLoading } */] = createCart();
  const [addCartItems /* { data: cartItems } */] = createCartItems();

  return (
    <div>
      <div>Checkout</div>
      <button
        type="button"
        onClick={() => {
          mutate({});
        }}
      >
        Create Cart
      </button>
      <button
        type="button"
        onClick={() => {
          addCartItems({
            cartId: '002fad02-b072-4dd5-a952-b25f1bbc9468',
            cartItems: items,
          });
        }}
      >
        Add Cart Items
      </button>
    </div>
  );
};

export { Checkout };
