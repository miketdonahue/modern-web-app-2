import { MigrationInterface, QueryRunner } from 'typeorm';

export class Actor1572404666921 implements MigrationInterface {
  public up = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE actor(
        id serial PRIMARY KEY,
        uuid uuid DEFAULT uuid_generate_v4(),
        role_id int NOT NULL,
        actor_account_id int NOT NULL,
        customer_id int NOT NULL,
        first_name varchar,
        last_name varchar,
        email varchar UNIQUE NOT NULL,
        password varchar NOT NULL,
        phone_country_code int,
        phone int,
        country varchar,
        address1 varchar,
        address2 varchar,
        city varchar,
        state varchar,
        postal_code int,
        created_at timestamptz,
        updated_at timestamptz,
        deleted_at timestamptz
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
