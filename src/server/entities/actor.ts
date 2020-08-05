import { Entity, Column } from 'typeorm';
import { Base } from './partials/base';

@Entity('actor')
export class Actor extends Base {
  @Column('uuid')
  public role_id: string;

  @Column('character varying', { nullable: true })
  public first_name: string | null;

  @Column('character varying', { nullable: true })
  public last_name: string | null;

  @Column('character varying', { unique: true })
  public email: string;

  @Column('character varying', { nullable: true })
  public password: string | null;

  @Column('character varying', { nullable: true })
  public phone_country_code: string | null;

  @Column('character varying', { nullable: true })
  public phone: string | null;

  @Column('character varying', { nullable: true })
  public country: string | null;

  @Column('character varying', { nullable: true })
  public address1: string | null;

  @Column('character varying', { nullable: true })
  public address2: string | null;

  @Column('character varying', { nullable: true })
  public city: string | null;

  @Column('character varying', { nullable: true })
  public state: string | null;

  @Column('character varying', { nullable: true })
  public postal_code: string | null;
}
