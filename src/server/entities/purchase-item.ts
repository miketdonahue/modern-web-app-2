import { Entity, Column } from 'typeorm';
import { Base } from './partials/base';

@Entity('purchase_item')
export class PurchaseItem extends Base {
  @Column('uuid')
  public purchase_id: string;

  @Column('character varying')
  public product_id: string;

  @Column('integer')
  public quantity: number;
}
