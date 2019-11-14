import { Entity, Column } from 'typeorm';
import { BaseTable } from './base-table';

@Entity('customer')
export class Customer extends BaseTable {
  @Column('int')
  public actor_id!: number;

  @Column('varchar')
  public stripe_id!: string;
}
