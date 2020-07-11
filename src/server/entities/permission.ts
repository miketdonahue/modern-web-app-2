import { Entity, Column } from 'typeorm';
import { BaseTable } from './partials/base-table';

@Entity('permission')
export class Permission extends BaseTable {
  @Column('character varying', { unique: true })
  public name: string;

  @Column('character varying', { unique: true })
  public key: string;

  @Column('character varying', { array: true, nullable: true })
  public roles: string[];
}
