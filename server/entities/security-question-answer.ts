import { Entity, Column } from 'typeorm';
import { BaseTable } from './base-table';

@Entity('security_question_answer')
export class SecurityQuestionAnswer extends BaseTable {
  @Column('int', { name: 'actor_account_id' })
  public actorAccountId!: number;

  @Column('int', { name: 'security_question_id' })
  public securityQuestionId!: number;

  @Column('varchar')
  public answer!: string;
}
