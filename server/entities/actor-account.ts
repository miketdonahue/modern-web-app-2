import { Entity, Column } from 'typeorm';
import { BaseTable } from './base-table';

@Entity('actor_account')
export class ActorAccount extends BaseTable {
  @Column('int', { name: 'actor_id' })
  public actorId!: number;

  @Column('boolean', { default: 'false' })
  public confirmed!: boolean;

  @Column('varchar', { name: 'confirmed_code', nullable: true })
  public confirmedCode!: string;

  @Column('boolean', { default: 'false' })
  public locked!: boolean;

  @Column('varchar', { name: 'locked_code', nullable: true })
  public lockedCode!: string;

  @Column('timestamptz', { name: 'locked_expires', nullable: true })
  public lockedExpires!: Date;

  @Column('varchar', { name: 'reset_password_code', nullable: true })
  public resetPasswordCode!: string;

  @Column('timestamptz', { name: 'reset_password_expires', nullable: true })
  public resetPasswordExpires!: Date;

  @Column('text', {
    name: 'security_questions',
    array: true,
    nullable: true,
  })
  public securityQuestions!: string[];

  @Column('int', { name: 'login_attempts', default: '0' })
  public loginAttempts!: number;

  @Column('int', { name: 'security_question_attempts', default: '0' })
  public securityQuestionAttempts!: number;

  @Column('varchar', { name: 'refresh_token', nullable: true })
  public refreshToken!: string;

  @Column('timestamptz', { name: 'last_visit', nullable: true })
  public lastVisit!: Date;

  @Column('varchar', { nullable: true })
  public ip!: string;
}
