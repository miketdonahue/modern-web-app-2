import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('security_question_answer')
export class SecurityQuestionAnswer {
  @PrimaryGeneratedColumn()
  public id!: number;

  @PrimaryGeneratedColumn('uuid')
  public uuid!: string;

  @Column('int', { name: 'actor_account_id' })
  public actorAccountId!: number;

  @Column('int', { name: 'security_question_id' })
  public securityQuestionId!: number;

  @Column('varchar')
  public answer!: string;

  @Column('timestamptz', { name: 'deleted_at', nullable: true })
  public deletedAt!: string;
}
