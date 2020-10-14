import React from 'react';
import { GetProduct } from '@typings/stripe';

type CartState = {
  items: GetProduct[];
  total: number;
  status: string;
};

type ShoppingCart = {
  items: GetProduct[];
  total: number;
  status: string;
  addCartItem: (item: GetProduct) => void;
  updateCart: (items: GetProduct[]) => void;
  removeCartItem: (item: GetProduct) => void;
};

export const useShoppingCart = (): ShoppingCart => {
  const initialState = { items: [], total: 0, status: 'new' };

  if (typeof window === 'undefined') {
    return initialState as any;
  }

  const storage = window.localStorage;
  const [state, setState] = React.useState<CartState>(initialState);

  const getCartTotal = (items: GetProduct[] = []) => {
    return items.reduce((acc: number, item: GetProduct) => {
      let result = acc;

      result +=
        ((item.relationships?.price.unit_amount || 0) *
          item.attributes.quantity) /
        100;

      return Number(result.toFixed(2));
    }, 0);
  };

  const addCartItem = (item: GetProduct) => {
    const storageCart = storage.getItem('cart') || '{}';
    const currentCart: CartState = JSON.parse(storageCart);

    /* Check if item already exists in cart */
    const existingItem = currentCart.items.find(
      (i) => i.attributes.id === item.attributes.id
    );

    /* If item exists, do not add, just update quantity */
    if (existingItem) {
      existingItem.attributes.quantity += 1;
    }

    const newCartItems = currentCart.items.concat({
      ...item,
      attributes: { ...item.attributes, quantity: 1 },
    });

    const newCartTotal = getCartTotal(
      existingItem ? currentCart.items : newCartItems
    );

    storage.setItem(
      'cart',
      JSON.stringify({
        ...currentCart,
        items: existingItem ? currentCart.items : newCartItems,
        total: newCartTotal,
        status: 'active',
      })
    );

    setState({
      ...state,
      items: existingItem ? currentCart.items : [...state.items, item],
      total: newCartTotal,
    });
  };

  const removeCartItem = (item: GetProduct) => {
    const storageCart = storage.getItem('cart') || '{}';
    const currentCart: CartState = JSON.parse(storageCart);
    const newCartItems = currentCart.items.filter(
      (product: GetProduct) => item.attributes.id !== product.attributes.id
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

  const updateCart = (items: GetProduct[]) => {
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
