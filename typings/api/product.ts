import { Data } from '@modules/api-response';
import { ProductWithQuantity, Product } from '../entities/product';

export type CartProduct = Data<ProductWithQuantity>;
export type GetProduct = Data<Product>;
