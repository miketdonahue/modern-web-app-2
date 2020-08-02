import { Entity, Column } from 'typeorm';
import { Base } from './partials/base';

@Entity('permission')
export class Permission extends Base {
  @Column('character varying', { unique: true })
  public name: string;

  @Column('character varying', { unique: true })
  public key: string;

  @Column('character varying', { array: true, nullable: true })
  public roles: string[];
}
