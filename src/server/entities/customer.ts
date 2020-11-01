import { Entity, Column } from 'typeorm';
import { Customer as Type } from '@typings/entities/customer';
import { Base } from './partials/base';

@Entity('customer')
export class Customer extends Base {
  @Column('uuid')
  public actor_id: Type['actor_id'];

  @Column('character varying', { nullable: true })
  public vendor_id: Type['vendor_id'];

  @Column('character varying', { nullable: true })
  public phone_country_code: Type['phone_country_code'];

  @Column('character varying', { nullable: true })
  public phone: Type['phone'];

  @Column('character varying', { nullable: true })
  public country: Type['country'];

  @Column('character varying', { nullable: true })
  public address_line1: Type['address_line1'];

  @Column('character varying', { nullable: true })
  public address_line2: Type['address_line2'];

  @Column('character varying', { nullable: true })
  public city: Type['city'];

  @Column('character varying', { nullable: true })
  public state: Type['state'];

  @Column('character varying', { nullable: true })
  public postal_code: Type['postal_code'];
}
