import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('actor')
export class Actor {
  @PrimaryGeneratedColumn()
  public id!: number;

  @PrimaryGeneratedColumn('uuid')
  public uuid!: string;

  @Column('int', { name: 'role_id' })
  public roleId!: number;

  @Column('int', { name: 'actor_account_id' })
  public actorAccountId!: string;

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

  @Column('int', { name: 'phone_country_code', nullable: true })
  public phoneCountryCode!: number;

  @Column('int', { nullable: true })
  public phone!: number;

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

  @Column('int', { name: 'postal_code', nullable: true })
  public postalCode!: number;

  @Column('timestamptz', { name: 'deleted_at', nullable: true })
  public deletedAt!: string;
}
