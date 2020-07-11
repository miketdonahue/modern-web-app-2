import { Entity, Column } from 'typeorm';
import { BaseTable } from './partials/base-table';

@Entity('feature_flag')
export class FeatureFlag extends BaseTable {
  @Column('character varying')
  public name: string;

  @Column('boolean', { default: false })
  public flag: boolean;
}
