import { Entity, Column } from 'typeorm';
import { ProductVideoActor as Type } from '@typings/entities/product-video-actor';
import { Base } from './partials/base';

@Entity('product_video_actor')
export class ProductVideoActor extends Base {
  @Column('character varying')
  public actor_id: Type['actor_id'];

  @Column('character varying')
  public product_video_id: Type['product_video_id'];

  @Column('boolean', { default: false })
  public watched: Type['watched'];
}
