import React from 'react';
import { Data } from '@modules/api-response/typings';
import { Product as ProductModel } from '@server/entities/product';

type Product = Data & {
  attributes: ProductModel;
};

type CartState = {
  cart: Product[];
  cartTotal: number;
};

type ShoppingCart = {
  cart: Product[];
  cartTotal: number;
  addCartItem: (item: Product) => void;
  removeCartItem: (item: Product) => void;
};

export const useShoppingCart = (): ShoppingCart => {
  if (typeof window === 'undefined') return { cart: [], cartTotal: 0 } as any;

  const storage = window.localStorage;
  const [state, setState] = React.useState<CartState>({
    cart: [],
    cartTotal: 0,
  });

  const cartTotal = () => {
    const storageCart = storage.getItem('cart') || '[]';
    const currentCart = JSON.parse(storageCart);

    return currentCart.reduce((acc: number, item: Product) => {
      let result = acc;
      result += item.attributes.price;
      return result;
    }, 0);
  };

  const addCartItem = (item: Product) => {
    const storageCart = storage.getItem('cart') || '[]';
    const currentCart = JSON.parse(storageCart);
    const newCart = currentCart.concat(item);

    storage.setItem('cart', JSON.stringify(newCart));
    setState({ ...state, cart: [...state.cart, item], cartTotal: cartTotal() });
  };

  const removeCartItem = (item: Product) => {
    const storageCart = storage.getItem('cart') || '[]';
    const currentCart = JSON.parse(storageCart);
    const newCart = currentCart.filter(
      (product: Product) => item.id !== product.id
    );

    storage.setItem('cart', JSON.stringify(newCart));
    setState({ ...state, cart: newCart, cartTotal: cartTotal() });
  };

  React.useEffect(() => {
    const storageCart = storage.getItem('cart') || '[]';

    if (!storageCart) {
      storage.setItem('cart', JSON.stringify([]));
    } else {
      const currentCart = JSON.parse(storageCart);
      setState({ cart: currentCart, cartTotal: cartTotal() });
    }
  }, []);

  return {
    cart: state.cart,
    cartTotal: state.cartTotal,
    addCartItem,
    removeCartItem,
  };
};
