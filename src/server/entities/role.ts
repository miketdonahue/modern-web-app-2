import { Entity, Column } from 'typeorm';
import { BaseTable } from './partials/base-table';

interface Permission {
  key?: string;
}

interface ProhibitedRoutes {
  paths?: string[];
}

export enum RoleName {
  ADMIN = 'admin',
  ACTOR = 'actor',
}

@Entity('role')
export class Role extends BaseTable {
  @Column('enum', { enum: RoleName, default: RoleName.ACTOR })
  public name: RoleName;

  @Column('character varying', { array: true, nullable: true })
  public permissions: Permission[];

  @Column('jsonb', { nullable: true })
  public prohibited_routes: ProhibitedRoutes | null;
}
