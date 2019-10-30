import { MigrationInterface, QueryRunner } from 'typeorm';

export class SecurityQuestion1572405301714 implements MigrationInterface {
  public up = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE security_question(
        id serial PRIMARY KEY,
        uuid uuid DEFAULT uuid_generate_v4(),
        short_name varchar NOT NULL UNIQUE,
        question text NOT NULL,
        created_at timestamptz NOT NULL,
        updated_at timestamptz NOT NULL,
        deleted_at timestamptz
      );
      `
    );
  };

  public down = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      DROP TABLE IF EXISTS security_question;
      `
    );
  };
}
