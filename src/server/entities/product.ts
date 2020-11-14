import { Entity, Column } from 'typeorm';
import { Product as Type } from '@typings/entities/product';
import { Base } from './partials/base';

@Entity('product')
export class Product extends Base {
  @Column('character varying')
  public vendor_id: Type['vendor_id'];

  @Column('character varying')
  public name: Type['name'];

  @Column('character varying')
  public filename: Type['filename'];

  @Column('character varying')
  public image_url: Type['image_url'];

  @Column('text')
  public description: Type['description'];

  @Column('character varying')
  public statement_descriptor: Type['statement_descriptor'];

  @Column('integer', { default: 0 })
  public price: Type['price'];

  @Column('boolean', { default: true })
  public active: Type['active'];
}
