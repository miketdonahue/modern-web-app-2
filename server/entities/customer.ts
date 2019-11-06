import { Entity, Column } from 'typeorm';
import { BaseTable } from './base-table';

@Entity('customer')
export class Customer extends BaseTable {
  @Column('int', { name: 'actor_id' })
  public actorId!: number;

  @Column('varchar', { name: 'stripe_id' })
  public stripeId!: string;
}
