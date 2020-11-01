import { Entity, Column } from 'typeorm';
import { Actor as Type } from '@typings/entities/actor';
import { Base } from './partials/base';

@Entity('actor')
export class Actor extends Base {
  @Column('uuid')
  public role_id: Type['role_id'];

  @Column('character varying', { nullable: true })
  public first_name: Type['first_name'];

  @Column('character varying', { nullable: true })
  public last_name: Type['last_name'];

  @Column('character varying', { unique: true })
  public email: Type['email'];

  @Column('character varying', { nullable: true })
  public password: Type['password'];
}
