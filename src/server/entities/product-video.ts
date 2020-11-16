import { Entity, Column } from 'typeorm';
import { ProductVideo as Type } from '@typings/entities/product-video';
import { Base } from './partials/base';

@Entity('product_video')
export class ProductVideo extends Base {
  @Column('character varying')
  public product_id: Type['product_id'];

  @Column('character varying')
  public title: Type['title'];

  @Column('character varying')
  public slug: Type['slug'];

  @Column('character varying')
  public image_url: Type['image_url'];

  @Column('character varying')
  public video_url: Type['video_url'];

  @Column('text')
  public description: Type['description'];

  @Column('int')
  public length: Type['length'];

  @Column('int')
  public ordering: Type['ordering'];
}
