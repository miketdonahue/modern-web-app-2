import React from 'react';
import { GetProduct } from '@typings/stripe';

export type ShoppingCartContext = {
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

export const ShoppingCartContext = React.createContext<ShoppingCartContext>({
  items: [],
  quantity: 0,
  total: 0,
  status: '',
  addCartItem: () => {},
  incrementItem: () => {},
  decrementItem: () => {},
  removeCartItem: () => {},
  updateCart: () => {},
  clearCart: () => {},
  calculateQuantity: () => 0,
});
