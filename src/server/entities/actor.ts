import { Entity, Column } from 'typeorm';
import { Base } from './partials/base';

@Entity('actor')
export class Actor extends Base {
  @Column('uuid')
  public role_id: string;

  @Column('character varying', { nullable: true })
  public first_name: string | null;

  @Column('character varying', { nullable: true })
  public last_name: string | null;

  @Column('character varying', { unique: true })
  public email: string;

  @Column('character varying', { nullable: true })
  public password: string | null;
}
