import { Entity, Column } from 'typeorm';
import { Base } from './partials/base';

@Entity('feature_flag')
export class FeatureFlag extends Base {
  @Column('character varying')
  public name: string;

  @Column('boolean', { default: false })
  public flag: boolean;
}
