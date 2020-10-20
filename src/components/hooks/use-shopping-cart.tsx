import React from 'react';
import { GetProduct } from '@typings/stripe';

type CartState = {
  items: GetProduct[];
  total: number;
  status: string;
};

export type ShoppingCartProps = {
  items: GetProduct[];
  quantity: number;
  total: number;
  status: string;
  addCartItem: (item: GetProduct) => void;
  incrementItem: (item: GetProduct) => void;
  decrementItem: (item: GetProduct) => void;
  removeCartItem: (item: GetProduct) => void;
  updateCart: (items: GetProduct[]) => void;
  clearCart: () => void;
  calculateQuantity: (items: GetProduct[]) => number;
};

export const useShoppingCart = (): ShoppingCartProps => {
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
    let newCartItems: GetProduct[] = [];

    /* See if the items already exists */
    const existingItem = currentCart.items.find(
      (i) => i.attributes.id === item.attributes.id
    );

    if (existingItem) {
      existingItem.attributes.quantity += 1;
    } else {
      newCartItems = currentCart.items.concat({
        ...item,
        attributes: { ...item.attributes, quantity: 1 },
      });
    }

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
      items: existingItem ? currentCart.items : newCartItems,
      total: newCartTotal,
    });
  };

  const incrementItem = (item: GetProduct) => {
    const storageCart = storage.getItem('cart') || '{}';
    const currentCart: CartState = JSON.parse(storageCart);

    /* Find the existing item to increment */
    const existingItem = currentCart.items.find(
      (i) => i.attributes.id === item.attributes.id
    );

    if (existingItem) {
      existingItem.attributes.quantity += 1;

      const newCartTotal = getCartTotal(currentCart.items);

      storage.setItem(
        'cart',
        JSON.stringify({
          ...currentCart,
          items: currentCart.items,
          total: newCartTotal,
          status: 'active',
        })
      );

      setState({
        ...state,
        items: currentCart.items,
        total: newCartTotal,
      });
    }
  };

  const decrementItem = (item: GetProduct) => {
    const storageCart = storage.getItem('cart') || '{}';
    const currentCart: CartState = JSON.parse(storageCart);

    /* Get the existing item to decrement */
    const existingItem = currentCart.items.find(
      (i) => i.attributes.id === item.attributes.id
    );

    if (existingItem) {
      existingItem.attributes.quantity -= 1;

      const newCartTotal = getCartTotal(currentCart.items);

      storage.setItem(
        'cart',
        JSON.stringify({
          ...currentCart,
          items: currentCart.items,
        })
      );

      setState({
        ...state,
        items: currentCart.items,
        total: newCartTotal,
      });
    }
  };

  const removeCartItem = (item: GetProduct) => {
    const storageCart = storage.getItem('cart') || '{}';
    const currentCart: CartState = JSON.parse(storageCart);

    const newCartItems = currentCart.items.filter(
      (product: GetProduct) => item.attributes.id !== product.attributes.id
    );

    const cartStatus = newCartItems.length > 0 ? 'active' : 'new';

    const newCartTotal = getCartTotal(newCartItems);

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
      total: newCartTotal,
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

  const clearCart = () => {
    storage.removeItem('cart');
  };

  const calculateQuantity = (items: GetProduct[]) => {
    return items?.reduce((acc, item) => {
      let result = acc;
      result += item.attributes?.quantity;
      return result;
    }, 0);
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
    quantity: calculateQuantity(state.items),
    total: state.total,
    status: state.status,
    addCartItem,
    updateCart,
    incrementItem,
    decrementItem,
    removeCartItem,
    clearCart,
    calculateQuantity,
  };
};
