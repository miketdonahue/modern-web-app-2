import { MigrationInterface, QueryRunner } from 'typeorm';

export class Permission1572405872034 implements MigrationInterface {
  public up = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE permission(
        id serial PRIMARY KEY,
        uuid uuid DEFAULT uuid_generate_v4(),
        name varchar NOT NULL UNIQUE,
        key varchar NOT NULL UNIQUE,
        roles varchar [],
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at timestamptz
      );
      `
    );
  };

  public down = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      DROP TABLE IF EXISTS permission;
      `
    );
  };
}
