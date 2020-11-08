import { Base } from './base';

export interface Purchase extends Base {
  customer_id: string;
  order_number: string;
  tax: number;
  subtotal: number;
  total: number;
}
