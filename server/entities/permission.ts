import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn()
  public id!: number;

  @PrimaryGeneratedColumn('uuid')
  public uuid!: string;

  @Column('varchar', { unique: true })
  public name!: string;

  @Column('varchar', { unique: true })
  public key!: string;

  @Column('varchar', { array: true, nullable: true })
  public roles!: string[];

  @Column('timestamptz', { name: 'deleted_at', nullable: true })
  public deletedAt!: string;
}
