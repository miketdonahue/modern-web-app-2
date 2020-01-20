import { Entity, Column } from 'typeorm';
import { BaseTable } from './partials/base-table';

@Entity('permission')
export class Permission extends BaseTable {
  @Column('varchar', { unique: true })
  public name: string;

  @Column('varchar', { unique: true })
  public key: string;

  @Column('varchar', { array: true, nullable: true })
  public roles: string[];
}
