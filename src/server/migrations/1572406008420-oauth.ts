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
        uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
        actor_id uuid NOT NULL,
        provider provider_enum NOT NULL,
        refresh_token varchar,
        expires_at timestamp with time zone,
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
      DROP TABLE IF EXISTS oauth;
      `
    );
  };
}
