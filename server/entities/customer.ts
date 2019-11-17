import { Entity, Column } from 'typeorm';
import { BaseTable } from './base-table';

@Entity('customer')
export class Customer extends BaseTable {
  @Column('uuid')
  public actor_id!: string;

  @Column('varchar')
  public stripe_id!: string;
}
