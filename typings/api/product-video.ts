import { Data } from '@modules/api-response';
import { ProductVideo } from '../entities/product-video';

export type GetProductVideo = Data<ProductVideo & { watched: boolean }>;
