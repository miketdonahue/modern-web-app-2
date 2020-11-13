import React from 'react';
import { useShoppingCart } from 'src/hooks/use-shopping-cart';
import { Cart } from './components/cart';
import { AddItem } from './components/add-item';
import { ShoppingCartContext } from './shopping-cart-context';

type ShoppingCartProps = {
  children: React.ReactNode;
};

const ShoppingCart = ({ children }: ShoppingCartProps) => {
  const {
    items,
    quantity,
    total,
    addCartItem,
    incrementItem,
    decrementItem,
    removeCartItem,
    deleteCart,
    calculateQuantity,
  } = useShoppingCart();

  return (
    <ShoppingCartContext.Provider
      value={{
        items,
        quantity,
        total,
        addCartItem,
        incrementItem,
        decrementItem,
        removeCartItem,
        deleteCart,
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
