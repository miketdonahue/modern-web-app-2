import { Data } from '@modules/api-response';
import { Base } from './base';

export interface Product extends Base {
  vendor_id: string;
  name: string;
  image_url: string;
  description: string;
  short_description: string;
  statement_descriptor: string;
  price: number;
  active: boolean;
}

interface ProductWithQuantity extends Product {
  quantity: number;
}

export type CartProduct = Data<ProductWithQuantity>;
export type GetProduct = Data<Product>;
