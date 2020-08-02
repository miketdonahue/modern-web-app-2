import { Entity, Column } from 'typeorm';
import { Base } from './partials/base';

@Entity('actor_account')
export class ActorAccount extends Base {
  @Column('uuid')
  public actor_id: string;

  @Column('boolean', { default: 'false' })
  public confirmed: boolean;

  @Column('character varying', { nullable: true })
  public confirmed_code: string | null;

  @Column('timestamp with time zone', { nullable: true })
  public confirmed_expires: Date | null;

  @Column('boolean', { default: 'false' })
  public locked: boolean;

  @Column('character varying', { nullable: true })
  public locked_code: string | null;

  @Column('timestamp with time zone', { nullable: true })
  public locked_expires: Date | null;

  @Column('character varying', { nullable: true })
  public reset_password_code: string | null;

  @Column('timestamp with time zone', { nullable: true })
  public reset_password_expires: Date | null;

  @Column('text', {
    array: true,
    nullable: true,
  })
  public security_questions: string[];

  @Column('int', { default: '0' })
  public login_attempts: number;

  @Column('int', { default: '0' })
  public security_question_attempts: number;

  @Column('character varying', { nullable: true })
  public refresh_token: string | null;

  @Column('timestamp with time zone', { nullable: true })
  public last_visit: Date | null;

  @Column('character varying', { nullable: true })
  public ip: string | null;
}
