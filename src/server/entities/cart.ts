import { Entity, Column } from 'typeorm';
import { Cart as Type, CART_STATUS } from '@typings/entities/cart';
import { Base } from './partials/base';

@Entity('cart')
export class Cart extends Base {
  @Column('uuid')
  public actor_id: Type['actor_id'];

  @Column('character varying', { default: CART_STATUS.NEW })
  public status: Type['status'];
}
