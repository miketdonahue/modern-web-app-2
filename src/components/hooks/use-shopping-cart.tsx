import React from 'react';
import { GetPrice } from '@modules/data-sources/prices';

type CartState = {
  items: GetPrice[];
  total: number;
  status: string;
};

type ShoppingCart = {
  items: GetPrice[];
  total: number;
  status: string;
  addCartItem: (item: GetPrice) => void;
  updateCart: (items: GetPrice[]) => void;
  removeCartItem: (item: GetPrice) => void;
};

export const useShoppingCart = (): ShoppingCart => {
  const initialState = { items: [], total: 0, status: 'new' };

  if (typeof window === 'undefined') {
    return initialState as any;
  }

  const storage = window.localStorage;
  const [state, setState] = React.useState<CartState>(initialState);

  const getCartTotal = (items: GetPrice[] = []) => {
    return items.reduce((acc: number, item: GetPrice) => {
      let result = acc;
      result += (item.unit_amount || 0) / 100;
      return Number(result.toFixed(2));
    }, 0);
  };

  const addCartItem = (item: GetPrice) => {
    const storageCart = storage.getItem('cart') || '{}';
    const currentCart: CartState = JSON.parse(storageCart);
    const newCartItems = currentCart.items.concat(item);
    const newCartTotal = getCartTotal(newCartItems);

    storage.setItem(
      'cart',
      JSON.stringify({
        ...currentCart,
        items: newCartItems,
        total: newCartTotal,
        status: 'active',
      })
    );

    setState({
      ...state,
      items: [...state.items, item],
      total: newCartTotal,
    });
  };

  const removeCartItem = (item: GetPrice) => {
    const storageCart = storage.getItem('cart') || '{}';
    const currentCart: CartState = JSON.parse(storageCart);
    const newCartItems = currentCart.items.filter(
      (product: GetPrice) => item.id !== product.id
    );
    const cartStatus = newCartItems.length > 0 ? 'active' : 'new';

    storage.setItem(
      'cart',
      JSON.stringify({
        ...currentCart,
        items: newCartItems,
        status: cartStatus,
      })
    );

    setState({
      ...state,
      items: newCartItems,
      total: getCartTotal(newCartItems),
      status: cartStatus,
    });
  };

  const updateCart = (items: GetPrice[]) => {
    const newCartTotal = getCartTotal(items);

    storage.setItem(
      'cart',
      JSON.stringify({
        items,
        total: newCartTotal,
        status: 'active',
      })
    );

    setState({
      ...state,
      items,
      total: newCartTotal,
    });
  };

  React.useEffect(() => {
    const storageCart = storage.getItem('cart') || '{}';
    const currentCart: CartState = JSON.parse(storageCart);
    const emptyCart = !Object.keys(currentCart).length;

    if (emptyCart) {
      storage.setItem('cart', JSON.stringify(initialState));
    } else {
      setState({
        items: currentCart.items,
        total: getCartTotal(currentCart.items),
        status: currentCart.status,
      });
    }
  }, []);

  return {
    items: state.items,
    total: state.total,
    status: state.status,
    addCartItem,
    updateCart,
    removeCartItem,
  };
};
