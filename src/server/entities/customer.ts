import { Entity, Column } from 'typeorm';
import { Base } from './partials/base';

@Entity('customer')
export class Customer extends Base {
  @Column('uuid')
  public actor_id: string;

  @Column('character varying')
  public stripe_id: string;
}
