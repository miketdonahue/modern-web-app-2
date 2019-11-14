import { Entity, Column } from 'typeorm';
import { BaseTable } from './base-table';

export enum ProviderName {
  GOOGLE = 'google',
}

@Entity('oauth')
export class Oauth extends BaseTable {
  @Column('int')
  public actor_id!: number;

  @Column('enum', { enum: ProviderName })
  public provider!: ProviderName;

  @Column('varchar')
  public access_token!: string;

  @Column('varchar', { nullable: true })
  public refresh_token!: string;

  @Column('timestamptz', { nullable: true })
  public expires_at!: Date;
}
