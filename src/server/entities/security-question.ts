import { Entity, Column } from 'typeorm';
import { Base } from './partials/base';

@Entity('security_question')
export class SecurityQuestion extends Base {
  @Column('character varying', { unique: true })
  public short_name: string;

  @Column('text')
  public question: string;
}
