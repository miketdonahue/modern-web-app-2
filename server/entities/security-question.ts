import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('security_question')
export class SecurityQuestion {
  @PrimaryGeneratedColumn()
  public id!: number;

  @PrimaryGeneratedColumn('uuid')
  public uuid!: string;

  @Column('varchar', { name: 'short_name', unique: true })
  public shortName!: string;

  @Column('text')
  public question!: string;

  @Column('timestamptz', { name: 'deleted_at', nullable: true })
  public deletedAt!: string;
}
