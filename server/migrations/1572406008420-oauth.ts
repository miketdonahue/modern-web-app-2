import { MigrationInterface, QueryRunner } from 'typeorm';

export class Oauth1572406008420 implements MigrationInterface {
  public up = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TYPE provider_enum AS ENUM (
        'google'
      );

      CREATE TABLE oauth(
        id serial PRIMARY KEY,
        uuid uuid DEFAULT uuid_generate_v4(),
        actor_id int NOT NULL,
        provider provider_enum NOT NULL,
        access_token varchar NOT NULL,
        refresh_token varchar,
        expires_at timestamptz,
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
      DROP TABLE IF EXISTS oauth;
      `
    );
  };
}
