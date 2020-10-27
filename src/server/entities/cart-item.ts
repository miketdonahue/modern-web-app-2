import { Entity, Column } from 'typeorm';
import { CartItem as Type } from '@typings/entities/cart-item';
import { Base } from './partials/base';

@Entity('cart_item')
export class CartItem extends Base {
  @Column('uuid')
  public cart_id: Type['cart_id'];

  @Column('character varying')
  public product_id: Type['product_id'];

  @Column('integer')
  public quantity: Type['quantity'];
}
