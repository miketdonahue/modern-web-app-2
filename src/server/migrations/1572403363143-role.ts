import { MigrationInterface, QueryRunner } from 'typeorm';

export class Role1572403363143 implements MigrationInterface {
  public up = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TYPE role_enum AS ENUM (
        'admin',
        'actor'
      );

      CREATE TABLE role(
        id serial PRIMARY KEY,
        uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
        name role_enum NOT NULL,
        permissions varchar [],
        prohibited_routes jsonb,
        created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
        updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
        deleted_at timestamp with time zone,
        deleted boolean NOT NULL DEFAULT false
      );
      `
    );
  };

  public down = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      DROP TABLE IF EXISTS role;
      `
    );
  };
}
