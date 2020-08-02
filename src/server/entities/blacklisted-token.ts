import { Entity, Column } from 'typeorm';
import { Base } from './partials/base';

@Entity('blacklisted_token')
export class BlacklistedToken extends Base {
  @Column('character varying')
  public token: string;
}
