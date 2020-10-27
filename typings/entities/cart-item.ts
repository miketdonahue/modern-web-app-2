import { Base } from './base';

export interface CartItem extends Base {
  cart_id: string;
  product_id: string;
  quantity: number;
}
