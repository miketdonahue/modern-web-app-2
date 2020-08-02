import { Entity, Column } from 'typeorm';
import { Base } from './partials/base';

interface Permission {
  key?: string;
}

interface ProhibitedRoutes {
  paths?: string[];
}

export const ROLE_NAME = {
  ADMIN: 'admin',
  ACTOR: 'actor',
};

@Entity('role')
export class Role extends Base {
  @Column('character varying', { default: ROLE_NAME.ACTOR })
  public name: string;

  @Column('character varying', { array: true, nullable: true })
  public permissions: Permission[];

  @Column('jsonb', { nullable: true })
  public prohibited_routes: ProhibitedRoutes | null;
}
