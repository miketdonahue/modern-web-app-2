import { Entity, Column } from 'typeorm';
import { BaseTable } from './base-table';

@Entity('security_question_answer')
export class SecurityQuestionAnswer extends BaseTable {
  @Column('int')
  public actor_account_id!: number;

  @Column('int')
  public security_question_id!: number;

  @Column('varchar')
  public answer!: string;
}
