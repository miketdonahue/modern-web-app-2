import React from 'react';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';
import { Cart } from './components/cart';
import { AddItem } from './components/add-item';
import { ShoppingCartContext } from './shopping-cart-context';

type ShoppingCart = {
  children: React.ReactNode;
};

const ShoppingCart = ({ children }: ShoppingCart) => {
  const {
    items,
    quantity,
    total,
    status,
    addCartItem,
    updateCart,
    incrementItem,
    decrementItem,
    removeCartItem,
    clearCart,
    calculateQuantity,
  } = useShoppingCart();

  return (
    <ShoppingCartContext.Provider
      value={{
        items,
        quantity,
        total,
        status,
        addCartItem,
        updateCart,
        incrementItem,
        decrementItem,
        removeCartItem,
        clearCart,
        calculateQuantity,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

// Sub-components
ShoppingCart.Cart = Cart;
ShoppingCart.AddItem = AddItem;

export { ShoppingCart };
