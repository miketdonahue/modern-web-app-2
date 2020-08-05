import { Entity, Column } from 'typeorm';
import { Base } from './partials/base';

@Entity('purchase')
export class Purchase extends Base {
  @Column('uuid')
  public customer_id: string;

  @Column('integer', { default: 0 })
  public tax: number;

  @Column('integer')
  public subtotal: number;

  @Column('integer')
  public total: number;
}
