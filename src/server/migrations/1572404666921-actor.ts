import { MigrationInterface, QueryRunner } from 'typeorm';

export class Actor1572404666921 implements MigrationInterface {
  public up = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE actor(
        id serial PRIMARY KEY,
        uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
        role_id uuid NOT NULL,
        customer_id uuid,
        first_name varchar,
        last_name varchar,
        email varchar UNIQUE NOT NULL,
        password varchar,
        phone_country_code varchar,
        phone varchar,
        country varchar,
        address1 varchar,
        address2 varchar,
        city varchar,
        state varchar,
        postal_code varchar,
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
      DROP TABLE IF EXISTS actor;
      `
    );
  };
}
