import { MigrationInterface, QueryRunner } from 'typeorm';

export class SecurityQuestionAnswer1572405667994 implements MigrationInterface {
  public up = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE security_question_answer(
        id serial PRIMARY KEY,
        uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
        actor_account_id uuid NOT NULL,
        security_question_id uuid NOT NULL,
        answer varchar NOT NULL,
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
      DROP TABLE IF EXISTS security_question_answer;
      `
    );
  };
}
