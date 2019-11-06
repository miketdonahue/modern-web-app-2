import { MigrationInterface, QueryRunner, getManager } from 'typeorm';
import { Permission } from '@server/entities/permission';

export class Permission1572503207173 implements MigrationInterface {
  public up = async (queryRunner: QueryRunner): Promise<any> => {
    const db = getManager('seed');

    await db.insert(Permission, [
      { name: 'Create Post', key: 'post:write:any' },
      { name: 'Read Post', key: 'post:read:any' },
    ]);
  };

  public down = async (queryRunner: QueryRunner): Promise<any> => {};
}
