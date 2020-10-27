import { CartProduct } from '@typings/entities/product';

export type ShoppingCartProps = {
  items: CartProduct[];
  quantity: number;
  total: number;
  status: string;
  addCartItem: (item: CartProduct) => void;
  incrementItem: (item: CartProduct) => void;
  decrementItem: (item: CartProduct) => void;
  removeCartItem: (item: CartProduct) => void;
  deleteCart: () => void;
  calculateQuantity: (items: CartProduct[]) => number;
};
