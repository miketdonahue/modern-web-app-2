import { Entity, Column, BeforeInsert } from 'typeorm';
import { Base } from './partials/base';
import generateOrderNumber from '../modules/code';

@Entity('purchase')
export class Purchase extends Base {
  @Column('uuid')
  public customer_id: string;

  @Column('character varying')
  public order_number: string;

  @Column('integer', { default: 0 })
  public tax: number;

  @Column('integer')
  public subtotal: number;

  @Column('integer')
  public total: number;

  @BeforeInsert()
  addOrderNumber() {
    this.order_number = generateOrderNumber(16);
  }
}
