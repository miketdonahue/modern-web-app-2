import { Base } from './base';

export interface ProductVideo extends Base {
  product_id: string;
  title: string;
  slug: string;
  image_url: string;
  video_url: string;
  description: string;
  length: number;
  ordering: number;
}
