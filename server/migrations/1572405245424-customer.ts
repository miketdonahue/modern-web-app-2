import { MigrationInterface, QueryRunner } from 'typeorm';

export class Customer1572405245424 implements MigrationInterface {
  public up = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE customer(
        id serial PRIMARY KEY,
        uuid uuid DEFAULT uuid_generate_v4(),
        actor_id int NOT NULL,
        stripe_id varchar NOT NULL,
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
      DROP TABLE IF EXISTS customer;
      `
    );
  };
}
