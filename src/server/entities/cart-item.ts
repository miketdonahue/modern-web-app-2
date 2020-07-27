import { Entity, Column } from 'typeorm';
import { BaseTable } from './partials/base-table';

@Entity('cart_item')
export class CartItem extends BaseTable {
  @Column('uuid')
  public cart_id: string;

  @Column('uuid')
  public product_id: string;

  @Column('integer')
  public quantity: number;
}
