import { Data } from '@modules/api-response';
import { Base } from './base';
import { CartItem } from './cart-item';
import { Product } from './product';

export interface Cart extends Base {
  actor_id: string;
  status: string;
}

export type GetCart = Data<
  Partial<Cart>,
  { cart_items: CartItem[]; products: Product[] }
>;

export type CartMethodResponse = Data<Partial<CartItem>, { product: Product }>;
