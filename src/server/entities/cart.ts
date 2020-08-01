import { Entity, Column } from 'typeorm';
import { BaseTable } from './partials/base-table';

export const CART_STATUS = {
  NEW: 'new',
  ACTIVE: 'active',
  CHECKOUT: 'checkout',
  PAID: 'paid',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
};

@Entity('cart')
export class Cart extends BaseTable {
  @Column('uuid')
  public actor_id: string;

  @Column('character varying', { default: CART_STATUS.NEW })
  public status: string;
}
