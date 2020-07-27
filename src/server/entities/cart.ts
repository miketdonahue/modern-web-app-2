import { Entity, Column } from 'typeorm';
import { BaseTable } from './partials/base-table';

export enum CartStatus {
  NEW = 'new',
  ACTIVE = 'active',
  CHECKOUT = 'checkout',
  PAID = 'paid',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

@Entity('cart')
export class Cart extends BaseTable {
  @Column('uuid')
  public actor_id: string;

  @Column('enum', { enum: CartStatus, default: CartStatus.NEW })
  public status: string;
}
