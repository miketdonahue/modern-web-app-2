import { Entity, Column } from 'typeorm';
import { BaseTable } from './partials/base-table';

@Entity('product')
export class Product extends BaseTable {
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
}
