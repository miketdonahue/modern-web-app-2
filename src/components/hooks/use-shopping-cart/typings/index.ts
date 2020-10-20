import { GetProduct } from '@typings/stripe';

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
