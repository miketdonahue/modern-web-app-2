import { Entity, Column } from 'typeorm';
import { BaseTable } from './base-table';

@Entity('actor')
export class Actor extends BaseTable {
  @Column('uuid')
  public role_id!: string;

  @Column('uuid', { nullable: true })
  public customer_id!: string;

  @Column('varchar', { nullable: true })
  public first_name!: string;

  @Column('varchar', { nullable: true })
  public last_name!: string;

  @Column('varchar', { unique: true })
  public email!: string;

  @Column('varchar')
  public password!: string;

  @Column('varchar', { nullable: true })
  public phone_country_code!: string;

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

  @Column('varchar', { nullable: true })
  public postal_code!: string;
}
