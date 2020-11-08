import { Base } from './base';

export interface Product extends Base {
  vendor_id: string;
  name: string;
  filename: string;
  image_url: string;
  description: string;
  short_description: string;
  statement_descriptor: string;
  price: number;
  active: boolean;
}

export interface ProductWithQuantity extends Product {
  quantity: number;
}
