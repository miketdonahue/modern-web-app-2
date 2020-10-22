import React from 'react';
import { useActor } from '@components/hooks/use-actor';
import { GetProduct } from '@typings/entities/product';
import {
  storageAddItem,
  storageRemoveItem,
  storageIncrementItem,
  storageDecrementItem,
  storageUpdateCart,
  storageClearCart,
} from './api/unauthenticated';
// import { serverAddItem } from './api/authenticated';
import { getCartTotal, calculateQuantity } from './utils';
import { initialState, reducer, types, ReducerState } from './reducer';
import { ShoppingCartProps } from './typings';

export const useShoppingCart = (): ShoppingCartProps => {
  const [actorId] = useActor();
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const isAuthenticated = !!actorId;

  /* Local Storage can only load client-side */
  if (typeof window === 'undefined') {
    return initialState as any;
  }

  const storage = window.localStorage;

  const addCartItem = (item: GetProduct) => {
    // return serverAddItem(item, dispatch);
    return storageAddItem(item, dispatch);
  };

  const removeCartItem = (item: GetProduct) => {
    return storageRemoveItem(item, dispatch);
  };

  const incrementItem = (item: GetProduct) => {
    return storageIncrementItem(item, dispatch);
  };

  const decrementItem = (item: GetProduct) => {
    return storageDecrementItem(item, dispatch);
  };

  const updateCart = (items: GetProduct[]) => {
    return storageUpdateCart(items, dispatch);
  };

  const clearCart = () => {
    return storageClearCart();
  };

  React.useEffect(() => {
    const storageCart = storage.getItem('cart') || '{}';
    const currentCart: ReducerState = JSON.parse(storageCart);
    const emptyCart = !Object.keys(currentCart).length;

    if (emptyCart) {
      storage.setItem('cart', JSON.stringify(initialState));
    } else {
      dispatch({
        type: types.SYNC_CART,
        payload: {
          items: currentCart.items,
          total: getCartTotal(currentCart.items),
          status: currentCart.status,
        },
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
