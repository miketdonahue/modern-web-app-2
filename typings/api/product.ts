import { Data } from '@modules/api-response';
import { ProductWithQuantity, Product } from '../entities/product';
import { ProductVideo } from '../entities/product-video';

export type CartProduct = Data<ProductWithQuantity>;
export type GetProduct = Data<Product>;
export type GetProductVideo = Data<ProductVideo>;
