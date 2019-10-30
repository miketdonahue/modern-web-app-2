import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blacklisted_token')
export class BlacklistedToken {
  @PrimaryGeneratedColumn()
  public id!: number;

  @PrimaryGeneratedColumn('uuid')
  public uuid!: string;

  @Column('varchar')
  public token!: string;

  @Column('timestamptz', { name: 'deleted_at', nullable: true })
  public deletedAt!: string;
}
