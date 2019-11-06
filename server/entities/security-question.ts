import { Entity, Column } from 'typeorm';
import { BaseTable } from './base-table';

@Entity('security_question')
export class SecurityQuestion extends BaseTable {
  @Column('varchar', { name: 'short_name', unique: true })
  public shortName!: string;

  @Column('text')
  public question!: string;
}
