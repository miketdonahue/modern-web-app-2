import { Entity, Column } from 'typeorm';
import { Base } from './partials/base';

@Entity('product')
export class Product extends Base {
  @Column('character varying')
  public name: string;

  @Column('character varying')
  public short_description: string;

  @Column('text')
  public description: string;

  @Column('character varying')
  public thumbnail: string;

  @Column('character varying')
  public image: string;

  @Column('double precision')
  public price: number;

  @Column('float', { default: 0 })
  public discount: number;
}
