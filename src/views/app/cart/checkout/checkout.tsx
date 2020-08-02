import React from 'react';
import { createCart, createCartItems } from '@modules/queries/carts';
import { Data } from '@modules/api-response/typings';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';

const Checkout = () => {
  const { items, updateCart } = useShoppingCart();
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
    <div>
      <div>Checkout</div>
    </div>
  );
};

export { Checkout };
