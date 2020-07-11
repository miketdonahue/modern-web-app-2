import { Entity, Column } from 'typeorm';
import { BaseTable } from './partials/base-table';

@Entity('customer')
export class Customer extends BaseTable {
  @Column('uuid')
  public actor_id: string;

  @Column('character varying')
  public stripe_id: string;
}
