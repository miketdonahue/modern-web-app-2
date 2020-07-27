import React from 'react';
import { Data } from '@modules/api-response/typings';
import { Product as ProductModel } from '@server/entities/product';

type Product = Data & {
  attributes: ProductModel;
};

type CartState = {
  items: Product[];
  total: number;
  status: string;
};

type ShoppingCart = {
  items: Product[];
  total: number;
  status: string;
  addCartItem: (item: Product) => void;
  removeCartItem: (item: Product) => void;
};

export const useShoppingCart = (): ShoppingCart => {
  const initialState = { items: [], total: 0, status: 'new' };

  if (typeof window === 'undefined') {
    return initialState as any;
  }

  const storage = window.localStorage;
  const [state, setState] = React.useState<CartState>(initialState);

  const getCartTotal = (items: Product[] = []) => {
    return items.reduce((acc: number, item: Product) => {
      let result = acc;
      result += item.attributes.price;
      return Number(result.toFixed(2));
    }, 0);
  };

  const addCartItem = (item: Product) => {
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

  const removeCartItem = (item: Product) => {
    const storageCart = storage.getItem('cart') || '{}';
    const currentCart: CartState = JSON.parse(storageCart);
    const newCartItems = currentCart.items.filter(
      (product: Product) => item.id !== product.id
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
    removeCartItem,
  };
};
