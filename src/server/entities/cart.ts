import { Entity, Column } from 'typeorm';
import { Cart as Type } from '@typings/entities/cart';
import { Base } from './partials/base';

export const CART_STATUS = {
  NEW: 'new',
  ACTIVE: 'active',
  CHECKOUT: 'checkout',
  PAID: 'paid',
  ABANDONED: 'abandoned',
};

@Entity('cart')
export class Cart extends Base {
  @Column('uuid')
  public actor_id: Type['actor_id'];

  @Column('character varying', { default: CART_STATUS.NEW })
  public status: Type['status'];
}
