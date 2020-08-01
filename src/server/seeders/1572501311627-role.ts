import { MigrationInterface, getManager } from 'typeorm';
import { Role, ROLE_NAME } from '@server/entities/role';

export class Role1572501311627 implements MigrationInterface {
  public up = async (): Promise<any> => {
    const db = getManager('seed');

    await db.insert(Role, [
      {
        name: ROLE_NAME.ADMIN,
      },
      {
        name: ROLE_NAME.ACTOR,
        permissions: [{ key: 'post:write:any' }, { key: 'post:read:any' }],
        prohibited_routes: { paths: ['/about'] },
      },
    ]);
  };

  public down = async (): Promise<any> => {};
}
