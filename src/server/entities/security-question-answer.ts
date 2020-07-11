import { Entity, Column } from 'typeorm';
import { BaseTable } from './partials/base-table';

@Entity('security_question_answer')
export class SecurityQuestionAnswer extends BaseTable {
  @Column('uuid')
  public actor_account_id: string;

  @Column('uuid')
  public security_question_id: string;

  @Column('character varying')
  public answer: string;
}
