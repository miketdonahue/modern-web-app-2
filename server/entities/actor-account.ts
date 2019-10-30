import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('actor_account')
export class ActorAccount {
  @PrimaryGeneratedColumn()
  public id!: number;

  @PrimaryGeneratedColumn('uuid')
  public uuid!: string;

  @Column('int', { name: 'actor_id' })
  public actorId!: number;

  @Column('boolean', { default: 'false' })
  public confirmed!: boolean;

  @Column('int', { name: 'confirmed_code', nullable: true })
  public confirmedCode!: number;

  @Column('boolean', { default: 'false' })
  public locked!: boolean;

  @Column('int', { name: 'locked_code', nullable: true })
  public lockedCode!: number;

  @Column('timestamptz', { name: 'locked_expires', nullable: true })
  public lockedExpires!: string;

  @Column('int', { name: 'reset_password_code', nullable: true })
  public resetPasswordCode!: number;

  @Column('timestamptz', { name: 'reset_password_expires', nullable: true })
  public resetPasswordExpires!: string;

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
  public lastVisit!: string;

  @Column('varchar', { nullable: true })
  public ip!: string;

  @Column('timestamptz', { name: 'deleted_at', nullable: true })
  public deletedAt!: string;
}
