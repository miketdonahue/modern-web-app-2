import { CartProduct } from '@typings/api/product';

export type ShoppingCartProps = {
  items: CartProduct[];
  quantity: number;
  total: number;
  addCartItem: (item: CartProduct) => void;
  incrementItem: (item: CartProduct) => void;
  decrementItem: (item: CartProduct) => void;
  removeCartItem: (item: CartProduct) => void;
  deleteCart: ({ browser }: { browser: boolean }) => void;
  calculateQuantity: (items: CartProduct[]) => number;
};
