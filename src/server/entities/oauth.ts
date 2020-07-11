import { Entity, Column } from 'typeorm';
import { BaseTable } from './partials/base-table';

export enum ProviderName {
  GOOGLE = 'google',
}

@Entity('oauth')
export class Oauth extends BaseTable {
  @Column('uuid')
  public actor_id: string;

  @Column('enum', { enum: ProviderName })
  public provider: ProviderName;

  @Column('character varying', { nullable: true })
  public refresh_token: string | null;

  @Column('timestamp with time zone', { nullable: true })
  public expires_at: Date | null;
}
