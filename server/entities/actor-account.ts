import { Entity, Column } from 'typeorm';
import { BaseTable } from './base-table';

@Entity('actor_account')
export class ActorAccount extends BaseTable {
  @Column('int')
  public actor_id!: number;

  @Column('boolean', { default: 'false' })
  public confirmed!: boolean;

  @Column('varchar', { nullable: true })
  public confirmed_code!: string;

  @Column('boolean', { default: 'false' })
  public locked!: boolean;

  @Column('varchar', { nullable: true })
  public locked_code!: string;

  @Column('timestamptz', { nullable: true })
  public locked_expires!: Date;

  @Column('varchar', { nullable: true })
  public reset_password_code!: string;

  @Column('timestamptz', { nullable: true })
  public reset_password_expires!: Date;

  @Column('text', {
    array: true,
    nullable: true,
  })
  public security_questions!: string[];

  @Column('int', { default: '0' })
  public login_attempts!: number;

  @Column('int', { default: '0' })
  public security_question_attempts!: number;

  @Column('varchar', { nullable: true })
  public refresh_token!: string;

  @Column('timestamptz', { nullable: true })
  public last_visit!: Date;

  @Column('varchar', { nullable: true })
  public ip!: string;
}
