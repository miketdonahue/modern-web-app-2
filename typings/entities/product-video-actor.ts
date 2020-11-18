import { Base } from './base';

export interface ProductVideoActor extends Base {
  actor_id: string;
  product_video_id: string;
  watched: boolean;
}
