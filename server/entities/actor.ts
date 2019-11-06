import { Entity, Column } from 'typeorm';
import { BaseTable } from './base-table';

@Entity('actor')
export class Actor extends BaseTable {
  @Column('int', { name: 'role_id' })
  public roleId!: number;

  @Column('int', { name: 'customer_id', nullable: true })
  public customerId!: string;

  @Column('varchar', { name: 'first_name', nullable: true })
  public firstName!: string;

  @Column('varchar', { name: 'last_name', nullable: true })
  public lastName!: string;

  @Column('varchar', { unique: true })
  public email!: string;

  @Column('varchar')
  public password!: string;

  @Column('varchar', { name: 'phone_country_code', nullable: true })
  public phoneCountryCode!: string;

  @Column('varchar', { nullable: true })
  public phone!: string;

  @Column('varchar', { nullable: true })
  public country!: string;

  @Column('varchar', { nullable: true })
  public address1!: string;

  @Column('varchar', { nullable: true })
  public address2!: string;

  @Column('varchar', { nullable: true })
  public city!: string;

  @Column('varchar', { nullable: true })
  public state!: string;

  @Column('varchar', { name: 'postal_code', nullable: true })
  public postalCode!: string;
}
