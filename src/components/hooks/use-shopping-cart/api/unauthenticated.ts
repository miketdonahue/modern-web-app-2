import { CartProduct } from '@typings/entities/product';
import { ReducerAction } from '@typings/react';
import { getCartTotal } from '../utils';
import { types, ReducerState } from '../reducer';

const storageAddItem = (
  item: CartProduct,
  dispatch: React.Dispatch<ReducerAction<Partial<ReducerState>>>
) => {
  const storage = window.localStorage;
  const storageCart = storage.getItem('cart') || '{}';
  const currentCart: ReducerState = JSON.parse(storageCart);
  let newCartItems: CartProduct[] = [];

  /* See if the items already exists */
  const existingItem = currentCart.items.find(
    (i) => i.attributes.id === item.attributes.id
  );

  if (existingItem) {
    existingItem.attributes.quantity += 1;
  } else {
    newCartItems = currentCart.items.concat({
      ...item,
      attributes: {
        ...item.attributes,
        quantity: 1,
      },
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

  dispatch({
    type: types.ADD_CART_ITEM,
    payload: {
      items: existingItem ? currentCart.items : newCartItems,
      total: newCartTotal,
    },
  });
};

const storageIncrementItem = (
  item: CartProduct,
  dispatch: React.Dispatch<ReducerAction<Partial<ReducerState>>>
) => {
  const storage = window.localStorage;
  const storageCart = storage.getItem('cart') || '{}';
  const currentCart: ReducerState = JSON.parse(storageCart);

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

    dispatch({
      type: types.INCREMENT_CART_ITEM,
      payload: {
        items: currentCart.items,
        total: newCartTotal,
      },
    });
  }
};

const storageDecrementItem = (
  item: CartProduct,
  dispatch: React.Dispatch<ReducerAction<Partial<ReducerState>>>
) => {
  const storage = window.localStorage;
  const storageCart = storage.getItem('cart') || '{}';
  const currentCart: ReducerState = JSON.parse(storageCart);

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

    dispatch({
      type: types.DECREMENT_CART_ITEM,
      payload: {
        items: currentCart.items,
        total: newCartTotal,
      },
    });
  }
};

const storageRemoveItem = (
  item: CartProduct,
  dispatch: React.Dispatch<ReducerAction<Partial<ReducerState>>>
) => {
  const storage = window.localStorage;
  const storageCart = storage.getItem('cart') || '{}';
  const currentCart: ReducerState = JSON.parse(storageCart);

  const newCartItems = currentCart.items.filter(
    (product: CartProduct) => item.attributes.id !== product.attributes.id
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

  dispatch({
    type: types.REMOVE_CART_ITEM,
    payload: {
      items: newCartItems,
      total: newCartTotal,
      status: cartStatus,
    },
  });
};

const storageDeleteCart = (
  dispatch: React.Dispatch<ReducerAction<Partial<ReducerState>>>
) => {
  const storage = window.localStorage;
  storage.removeItem('cart');

  dispatch({
    type: types.DELETE_CART,
  });
};

export {
  storageAddItem,
  storageRemoveItem,
  storageIncrementItem,
  storageDecrementItem,
  storageDeleteCart,
};
