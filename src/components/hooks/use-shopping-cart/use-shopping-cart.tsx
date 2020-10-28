import React from 'react';
import { useActor } from '@components/hooks/use-actor';
import { CartProduct } from '@typings/entities/product';
import { getMyCart } from '@modules/data-sources/carts';
import {
  storageAddItem,
  storageRemoveItem,
  storageIncrementItem,
  storageDecrementItem,
  storageDeleteCart,
} from './api/unauthenticated';
import {
  serverAddItem,
  serverDecrementItem,
  serverIncrementItem,
  serverRemoveItem,
  serverDeleteCart,
} from './api/authenticated';
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

  const addCartItem = (item: CartProduct) => {
    if (isAuthenticated) {
      return serverAddItem(item, dispatch);
    }

    return storageAddItem(item, dispatch);
  };

  const removeCartItem = (item: CartProduct) => {
    if (isAuthenticated) {
      return serverRemoveItem(item, dispatch);
    }

    return storageRemoveItem(item, dispatch);
  };

  const incrementItem = (item: CartProduct) => {
    if (isAuthenticated) {
      return serverIncrementItem(item, dispatch);
    }

    return storageIncrementItem(item, dispatch);
  };

  const decrementItem = (item: CartProduct) => {
    if (isAuthenticated) {
      return serverDecrementItem(item, dispatch);
    }

    return storageDecrementItem(item, dispatch);
  };

  const deleteCart = ({ browser }: { browser: boolean }) => {
    if (browser) {
      return storageDeleteCart(dispatch);
    }

    return serverDeleteCart(dispatch);
  };

  /* Ensure initial state is set on first load of shopping cart */
  React.useEffect(() => {
    if (!isAuthenticated) {
      const storageCart = storage.getItem('cart') || '{}';
      const currentCart: ReducerState = JSON.parse(storageCart);
      const emptyCart = !Object.keys(currentCart).length;

      if (emptyCart) {
        storage.setItem('cart', JSON.stringify(initialState));
      } else {
        dispatch({
          type: types.INIT_CART,
          payload: {
            items: currentCart.items,
            total: getCartTotal(currentCart.items),
            status: currentCart.status,
          },
        });
      }
    } else {
      const getCartData = async () => {
        const myCart = await getMyCart();

        const products = myCart.data?.relationships?.products.map((product) => {
          const cartItem = myCart.data?.relationships?.cart_items.find(
            (c) => c.product_id === product.id
          );

          return {
            attributes: { ...product, quantity: cartItem?.quantity || 0 },
          };
        });

        dispatch({
          type: types.INIT_CART,
          payload: {
            items: products || [],
            total: getCartTotal(products),
            status: myCart.data?.attributes.status || '',
          },
        });
      };

      getCartData();
    }
  }, [actorId]);

  return {
    items: state.items,
    quantity: calculateQuantity(state.items),
    total: state.total,
    status: state.status,
    addCartItem,
    incrementItem,
    decrementItem,
    removeCartItem,
    deleteCart,
    calculateQuantity,
  };
};
