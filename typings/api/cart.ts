import { Data } from '@modules/api-response';
import { CartItem } from '../entities/cart-item';
import { Cart } from '../entities/cart';
import { Product } from '../entities/product';

export type GetCart = Data<
  Partial<Cart>,
  { cart_items: CartItem[]; products: Product[] }
>;

export type CartMethodResponse = Data<Partial<CartItem>, { product: Product }>;
