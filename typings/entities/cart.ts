import { Data } from '@modules/api-response';
import { Base } from './base';
import { CartItem } from './cart-item';
import { Product } from './product';

export enum CART_STATUS {
  NEW = 'new',
  ACTIVE = 'active',
  CHECKOUT = 'checkout',
  PAID = 'paid',
  ABANDONED = 'abandoned',
}

export interface Cart extends Base {
  actor_id: string;
  status: CART_STATUS;
}
