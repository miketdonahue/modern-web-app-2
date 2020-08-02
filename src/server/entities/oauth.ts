import { Entity, Column } from 'typeorm';
import { Base } from './partials/base';

export const PROVIDER_NAME = {
  GOOGLE: 'google',
};

@Entity('oauth')
export class Oauth extends Base {
  @Column('uuid')
  public actor_id: string;

  @Column('character varying')
  public provider: string;

  @Column('character varying', { nullable: true })
  public refresh_token: string | null;

  @Column('timestamp with time zone', { nullable: true })
  public expires_at: Date | null;
}
