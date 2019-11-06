import { Entity, Column } from 'typeorm';
import { BaseTable } from './base-table';

export enum ProviderName {
  GOOGLE = 'google',
}

@Entity('oauth')
export class Oauth extends BaseTable {
  @Column('int', { name: 'actor_id' })
  public actorId!: number;

  @Column('enum', { enum: ProviderName })
  public provider!: ProviderName;

  @Column('varchar', { name: 'access_token' })
  public accessToken!: string;

  @Column('varchar', { name: 'refresh_token', nullable: true })
  public refreshToken!: string;

  @Column('timestamptz', { name: 'expires_at', nullable: true })
  public expiresAt!: Date;
}
