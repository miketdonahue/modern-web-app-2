import { Entity, Column } from 'typeorm';
import { BaseTable } from './partials/base-table';

@Entity('actor_account')
export class ActorAccount extends BaseTable {
  @Column('uuid')
  public actor_id: string;

  @Column('boolean', { default: 'false' })
  public confirmed: boolean;

  @Column('varchar', { nullable: true })
  public confirmed_code: string | null;

  @Column('timestamp with time zone', { nullable: true })
  public confirmed_expires: Date | null;

  @Column('boolean', { default: 'false' })
  public locked: boolean;

  @Column('varchar', { nullable: true })
  public locked_code: string | null;

  @Column('timestamp with time zone', { nullable: true })
  public locked_expires: Date | null;

  @Column('varchar', { nullable: true })
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

  @Column('varchar', { nullable: true })
  public refresh_token: string | null;

  @Column('timestamp with time zone', { nullable: true })
  public last_visit: Date | null;

  @Column('varchar', { nullable: true })
  public ip: string | null;
}
