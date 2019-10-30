import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum RoleName {
  ADMIN = 'admin',
  ACTOR = 'actor',
}

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  public id!: number;

  @PrimaryGeneratedColumn('uuid')
  public uuid!: string;

  @Column('enum', { enum: RoleName, default: RoleName.ACTOR })
  public name!: RoleName;

  @Column('varchar', { array: true, nullable: true })
  public permissions!: string[];

  @Column('jsonb', { name: 'prohibited_routes', nullable: true })
  public prohibitedRoutes!: Record<string, any>;

  @Column('timestamptz', { name: 'deleted_at', nullable: true })
  public deletedAt!: string;
}
