import { Entity, Column } from 'typeorm';
import { Base } from './partials/base';

@Entity('cart_item')
export class CartItem extends Base {
  @Column('uuid')
  public cart_id: string;

  @Column('uuid')
  public product_id: string;

  @Column('integer')
  public quantity: number;
}
